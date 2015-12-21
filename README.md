### Qlikview d3 Zoomable Sunburst Extension

[![Join the chat at https://gitter.im/countnazgul/ZoomableSunburst](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/countnazgul/ZoomableSunburst?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

The extension is based on [Zoomable Sunburst with Labels](http://bl.ocks.org/metmajer/5480307)

***Make sure that the root element (node1 in the screenshot below) have "-" in the parent field!***

### Options
* Tooltip format - QV string formated html. For example: `node & '<br/> <b>'  & sum(value) & '<b>'`
* Color Expression - QV string representation of color. For example: `if(value > 10, 'blue', 'green')`. Instead `blue`, RGB or HEX color formats are accepted
* Font size
* Font family
* Color scheme - thanks to Cynthia Brewer you can pick from one of many coloring options
* Color Sub Scheme
* Opacity - transparency from 0 to 100
* Zoom speed (ms) - control the speed of zoom in/out
* Width
* Height
* Border color - the border color of each arc. Accept readable colors ( like "green", "white" etc. ), HEX colors ( like "#fff" ) and RGB colors ( like "RGB(255, 255, 255)" )
* Border width - arc border width
* Tooltip style - tooltip css. For example:

```
position: absolute;
text-align: center;
width: none;
height: none;
padding: 2px;
font: 12px sans-serif;
background: lightsteelblue;
border: 0px;
border-radius: 8px;
pointer-events: none;
```  


### Screenshots
![Example](https://raw.githubusercontent.com/countnazgul/ZoomableSunburst/master/Screenshots/Qlikview_Zoomable_Sunburst.gif)
