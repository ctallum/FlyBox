# FlyBox
Olin SCOPE - Brandeis Rosbash Lab FlyBox Redesign

# Software Workflow
## Design Rationale
We wanted to create a software workflow that was intuitive so that any user could easily program a FlyBox. We were working with the following assumptions: 
1) Once a test starts, the test parameters do not need to be changed.
2) Tests are often small modifications to prior tests -- most tests are fundamentally pretty similar to each other.
3) The software workflow should be designed for the current workflow and test parameters. We should design a software workflow that is intuitive and functional for current work methods and not try to plan for all future changes.

<!-- end of the list -->
With these asumptions, we envisioned the following workflow:
1) The user will go to an online web user interface and will be able to program a test visually with drag and drop blocks. Similar to how one can schedule events in a calander app.
2) The user will be able to click a "download button" and the current test program will be downloaded as a ".txt" file. The user should also be able to "upload" a ".txt" file and be able to make modifications to prior tests.
3) Once the user downlaods the file, they can put it onto an SD card. The SD card can hold multiple different flybox test profiles. 
4) The user will be able to insert the SD card into the FlyBox and, through a graphical interface, should be able to select which test program they want to run. 
5) The FlyBox will be able to interpert the ".txt" file and recreate the lighting patterns programed in the web UI. 

# About the Web UI
## Source Code
All the source code and documentation for the webside can be found [here](https://github.com/ctallum/FlyBox/tree/main/programming-gui)

To access the website, visit:
https://flybox-test-creator.github.io/FlyBox/

