
// Declare area of interest as Area1

// Date Range
var d0 = '2018-01-01'
var d1 = '2022-12-31'

var band = "SO2_column_number_density"

var col_name = "COPERNICUS/S5P/NRTI/L3_SO2"

function Counter(aoi){
  
  Map.centerObject(aoi,10);
  
  // Function to Clip Image with the AOI
  
  function clipper(image){
    return image.clip(aoi);}
  
  // Function to scale or change units 
  
  function scaller(image){
    return image.select(band)
                .multiply(2241.3986327468340244312450969405) //Convert to Dobson Units 
                .set('system:time_start',image.get('system:time_start'))
                ;}
                
  // Function to remove values below 0. The user manual suggests -1, but that continues to give negative values in the trend. You may change it as per your suitability
  
  function booster(image){
    var a = image.select(band)
    var mask = a.gte(0)
    return image.updateMask(mask).select(band)
  } 
  
  // Declare Collection
  
  var dataset = ee.ImageCollection(col_name)
                .filterDate(d0, d1)   //Filter by Dates
                .filterBounds(aoi)    //Filter Bounds
                .select(band)         //Select Band
                .map(clipper)         //Clip collection by AOI
                .map(scaller)        //Scale images
                .map(booster)
                
  //Print Dataset
  print('dataset0',dataset);
  
  //This variable defines the length of the moving window. In this case it is set to 7 to commpute the weekly mean
  var window_size = 7;
  
  //Define function that generates a list of week numbers and maps over it 
  //to compute the weekly mean and create a new collection 
  
  function charter(dataset, dt, ew){
    
    var startWeek = 0; 
    var endWeek = ew;
    
    // Create a list of number of weeks
    var time_list = ee.List.sequence(startWeek, endWeek);
    
    //Creating a new collection using week list
    var collection = ee.ImageCollection.fromImages(time_list.map(function (day){
      //This variable helps the window move with respect to the initial date based on the week number  
      var jump_variable = ee.Number.expression('day*x',{
        'day' : day,
        'x' : window_size
        });
        
      //Define the first date of the new image
      var start2 = ee.Date(dt).advance(jump_variable,'day');
      
      //Make new image based on the window size
      var img_mosaic2 = dataset.select(band).filterDate(start2,start2.advance(window_size, 'day'))
                  .reduce(ee.Reducer.mean())
                  .set('system:time_start',(start2.millis())) // We need the new image to retain this info for convenient plotting 
        var img_mosaic_date2 = img_mosaic2.rename('Gas');  
        return img_mosaic_date2;
      }).flatten());
    
      print (collection)
  
    //Charter
    var GAS_chart = ui.Chart.image.series({imageCollection: collection.select('Gas'),
                                                    region:aoi, 
                                                    reducer: ee.Reducer.mean(),
                                                    scale: 1000,
                                                    xProperty: 'system:time_start'
    }).setOptions({title: dt, pointSize: 3,
                  legend: {maxLines: 12, position: 'top'},
                  // Adds titles to each axis.
                  vAxes: {
                          0: {title: 'SO2 (Dobson Units)'}},
                  hAxes:{
                          0: {title: 'Week Number'}},
    });
  
    print(GAS_chart);
  }
  //Plotting charts for 52 weeks of individual year
  charter(dataset,"2019-01-01",52)
  charter(dataset,"2020-01-01",52)
  charter(dataset,"2021-01-01",52)
  charter(dataset,"2022-01-01",52)

}

//You May run this over multiple areas through Counter(Area2), Counter(Area3), Counter(Area4), Counter(Area5) ... etc.
Counter(aoi)
