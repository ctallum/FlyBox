#include "firmware.h"



Time* ConvertTime(unsigned int day, unsigned int hour, unsigned int min){
  struct Time* time = (struct Time*)malloc(sizeof(struct Time));

  time->day = day;
  time->hour = hour;
  time->min = min;

  return time;
}

