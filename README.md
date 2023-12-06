# Pollutant Trend Analysis
The following repository contains GEE Python and JavaScript codes for plotting Sentinel-5P data (CO, NO2, SO2)

## GEE Annual Trend (Javascript)
The Google Earth Engine codes include:
  1. CO_Trends
  2. NO2_Trends
  3. SO2_Trends
 The codes generate separate trend charts for individual years between the date range

Here are some parts of the code that I believe might assist in understanding the code better
 Line 22: All images are multiplied by a certain value to make the mean values more comprehensive (CO and NO2) or change units (SO2)

 Line 39: Variable "window_size" defines the period for which the mean of the images is calculated. Since it is realized that the number of available images in a fixed interval may or may not be the same, a period-based approach is adopted where the period is defined by "window_size".
 The functioning of the charter code is explained below:
 
 ![Slide1](https://github.com/NotnirwaN/Pollutant_Trend_Analysis/assets/106248449/3775de2a-3bf4-45b7-bfee-8c4af015e530)
 Assuming there is a collection with some missing images.

 ![Slide2](https://github.com/NotnirwaN/Pollutant_Trend_Analysis/assets/106248449/ca3cc70c-8714-43be-8821-fb08a0d27b28)
 On the first iteration, the mean of all images in the window is taken, i.e., the first week of the collection.
 
 ![Slide3](https://github.com/NotnirwaN/Pollutant_Trend_Analysis/assets/106248449/d8ee0102-9043-409e-8f4f-351c601695ca)
 After the successful completion of the first iteration, the entire window moves forward by 7 days based on the variable value of "jump_variable".

 ![Slide4](https://github.com/NotnirwaN/Pollutant_Trend_Analysis/assets/106248449/5e2c17e3-9aae-4287-8b33-4ed19e65165d)
 For the third iteration, the window moves by 14 days and creates the mean of the next 7 days, i.e. week 3.

 ![Slide5](https://github.com/NotnirwaN/Pollutant_Trend_Analysis/assets/106248449/4906d719-9f09-43ca-ad6e-94dae8e6032d)
 The window continues to move forward with respect to the start date as mentioned in line 61 where we advance the number of days equivalent to "jump_variable" from the start date "dt".

 ![Slide6](https://github.com/NotnirwaN/Pollutant_Trend_Analysis/assets/106248449/84a8a983-d021-4503-bdee-09d452094315)
 It is important to note that this method will create an image even if there is a single image in the window. Hence this method generates 53 weekly images in a year since there is always one (or two in case of leap year) image(s) left after computing 52 weeks.

 The above part also helps one understand the input of number 52 in lines 91-94 as there are 52 weeks in a year. This leads to the formation of 53 images since the count begins from 0. In case an individual changes the "window_size" to 30, the charter variable "ew" will be 12. 

## GEE Annual Trend (Python)
The Python API base codes include the following:
  1. 04122023_Sentinel5P_Data_Manager.ipynb
  2. 04122023_Sentinel5P_Weekly_Data_Manager.ipynb
  The above set of codes creates excel sheets containing the daily and weekly pollutant trends in your drive where the .ipynb file is located.
To convert the mean values of the images from an ee object to a local value, the .getInfo() function is used. This function will fail if the collection is too big. Furthermore, it is too time-consuming to use the function over individual images. Hence the input dates are broken down into smaller sets of 60 days. This prevents the .getInfo from failing while still assuring efficient computation over the time-period. 

The code primarily works on the same logic adopted by javascript for creating the weekly mean. To change the window size, the user will have to change the variable "n". 

Note: This code further removes any extreme values in the image that may lead to biased mean values in the pollutant trends using the user-defined function "chipper".
