#ifndef buttons_h
#define buttons_h


#define BUTTON_UP 15
#define BUTTON_DOWN 13
#define BUTTON_ENTER 4

// Rotary Encoder Inputs
#define CLK 15
#define DT 4
#define SW 13



void init_buttons();
long get_rotary_info();

#endif

