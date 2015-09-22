// Zoomable Sunburst Qlikview Extension
// Author: stefan.stoichev@gmail.com
// Version: 0.3.0
// Repo: https://github.com/countnazgul/ZoomableSunburst
// d3 example used: http://bl.ocks.org/mbostock/4348373

var _path = Qva.Remote + "?public=only&name=Extensions/ZoomableSunburst/";
var selectedNode = '';
function extension_Init()
{
    Qva.LoadScript(_path + "jquery.js", function() {
        Qva.LoadScript(_path + "d3.min.js", function() {
          Qva.LoadScript(_path + "colorbrewer.js", extension_Done );
        });
    });
}

if (Qva.Mgr.mySelect == undefined) {
    Qva.Mgr.mySelect = function (owner, elem, name, prefix) {
        if (!Qva.MgrSplit(this, name, prefix)) return;
        owner.AddManager(this);
        this.Element = elem;
        this.ByValue = true;

        elem.binderid = owner.binderid;
        elem.Name = this.Name;

        elem.onchange = Qva.Mgr.mySelect.OnChange;
        elem.onclick = Qva.CancelBubble;
    }
    Qva.Mgr.mySelect.OnChange = function () {
        var binder = Qva.GetBinder(this.binderid);
        if (!binder.Enabled) return;
        if (this.selectedIndex < 0) return;
        var opt = this.options[this.selectedIndex];
        binder.Set(this.Name, 'text', opt.value, true);
    }
    Qva.Mgr.mySelect.prototype.Paint = function (mode, node) {
        this.Touched = true;
        var element = this.Element;
        var currentValue = node.getAttribute("value");
        if (currentValue == null) currentValue = "";
        var optlen = element.options.length;
        element.disabled = mode != 'e';

        for (var ix = 0; ix < optlen; ++ix) {
            if (element.options[ix].value === currentValue) {
                element.selectedIndex = ix;
            }
        }
        element.style.display = Qva.MgrGetDisplayFromMode(this, mode);
    }
}

function extension_Done(){
	Qva.AddExtension('ZoomableSunburst', function(){
		var _this 				= this;
		//var showValues 			= _this.Layout.Text0.text.toString();
		var fontSize 			= _this.Layout.Text0.text.toString() + 'px';
		var fontFamily 			= _this.Layout.Text1.text.toString();
		var colorScheme 		= _this.Layout.Text2.text.toString();
		var colorSchemeNo		= _this.Layout.Text3.text.toString();
    var showValues = false;
		// if(showValues == '' || showValues == 0) {
		//   showValues = false;
		// } else {
		//   showValues = true;
		// }

		var divName = _this.Layout.ObjectId.replace("\\", "_");

		if(_this.Element.children.length == 0) {
			var ui = document.createElement("div");
			ui.setAttribute("id", divName);
			_this.Element.appendChild(ui);
		} else {
			$("#" + divName).empty();
		}

		var td = _this.Data;
		var nodesArray = [];
		var parents = [];

		for(var rowIx = 0; rowIx < td.Rows.length; rowIx++) {

			var row = td.Rows[rowIx];

			var val1 = row[0].text;
			var val2 = row[1].text;
			var m = row[2].text;

			var node =  [{"name":val2},{"parent":val1},{"size":m}];
			nodesArray.push(node);
			parents.push(row[0].text)
		}

		var uniqueParents = parents.filter(function(itm,i,a){
			return i==a.indexOf(itm);
		});

		if( uniqueParents.length == 0 ) {
			nodesArray.push([{"name":uniqueParents[0]},{"parent":'-'},{"size":1}]);
		} else {
			if( selectedNode ) {
				for( var i = 0; i < uniqueParents.length; i++) {
					if( uniqueParents[i] == selectedNode) {
						nodesArray.push([{"name":uniqueParents[i]},{"parent":'-'},{"size":1}]);
					}
				}
			}
		}

		var nodesJson = createJSON(nodesArray);

		function createJSON(Data) {
		  var happyData = Data.map(function(d) {
		    return {
		      name: d[0].name,
		      parent: d[1].parent,
		      size: d[2].size
		    };
		  });

		  function getChildren(name) {
		    return happyData.filter(function(d) { return d.parent === name; })
		      .map(function(d) {
              var values = '';
              if( showValues == true ) {
                values = ' (' + parseInt(d.size).toLocaleString() + ')';
              }
		        return {
		          name: d.name + '' + values,
		          size: d.size,
		          children: getChildren(d.name)
		        };
		      });
		  }
		  return getChildren('-')[0];
		}

		var selectedNodes = [];
		function traverse(o ) {
			for (i in o) {
				if (typeof(o[i])=="object") {
				  if (o[i].name) {
					selectedNodes.push((o[i].name));
				  }

				  traverse(o[i]);
				}
			}
		}

		function removeProp(obj, propName) {
		  for (var p in obj) {
			if (obj.hasOwnProperty(p)) {
			  if (p == propName) {
				delete obj[p];
			  } else if (typeof obj[p] == 'object') {
				removeProp(obj[p], propName);
			  }
			}
		  }
		  return obj;
		}

    var width = 600,
        height = 700,
        radius = Math.min(width, height) / 2;

    var x = d3.scale.linear()
        .range([0, 2 * Math.PI]);

    var y = d3.scale.linear()
        .range([0, radius]);
//alert( colorScheme + ' ' + colorSchemeNo + ' --> ' + colorbrewer[colorScheme][colorSchemeNo]);
    var color = d3.scale.ordinal()
           .range( colorbrewer[colorScheme][colorSchemeNo])
    ;

    var svg = d3.select("#" + divName).append("svg")
        .attr("width", width)
        .attr("height", height)
        .append("g")
        .attr("transform", "translate(" + width / 2 + "," + (height / 2 + 10) + ")");

    var partition = d3.layout.partition()
        .value(function(d) { 
		//alert(d.depth);
		if(d.depth <= 3) {
				return d.size;
			} else {
				null
			} 
			/*if( d.size > 5000 ) {
				return d.size;
			} else {
				null
			} */
		})		
		;
		
		//console.log((partition)

    var arc = d3.svg.arc()
        .startAngle(function(d) { return Math.max(0, Math.min(2 * Math.PI, x(d.x))); })
        .endAngle(function(d) { return Math.max(0, Math.min(2 * Math.PI, x(d.x + d.dx))); })
        .innerRadius(function(d) { return Math.max(0, y(d.y)); })
        .outerRadius(function(d) { return Math.max(0, y(d.y + d.dy)); });

      var root = nodesJson;

      var g = svg.selectAll("g")
          .data(partition.nodes(root))
          .enter().append("g")
        ;

      var path = g.append("path")
        .attr("d", arc)
        .style("fill", function(d) {
            return color((d.children ? d : d.parent).name);
          })
        .style("opacity", 0.7)
        .on("click", click)
        ;

		
      var text = g.append("text")
        .attr("transform", function(d) { return "rotate(" + computeTextRotation(d) + ")"; })
        .attr("x", function(d) { return y(d.y); })
        .attr("dx", "6") // margin
        .attr("dy", ".35em") // vertical-align
        .attr("font-size", fontSize)
        .attr("font-family", fontFamily)
        .text(function(d) { return d.name })


      function click(d) {
        // fade out all text elements
        text.transition().attr("opacity", 0);

        path.transition()
          .duration(750)
          .attrTween("d", arcTween(d))
          .each("end", function(e, i) {
              // check if the animated element's data e lies within the visible angle span given in d
              if (e.x >= d.x && e.x < (d.x + d.dx)) {
                // get a selection of the associated text element
                var arcText = d3.select(this.parentNode).select("text");
                // fade in the text element and recalculate positions
                arcText.transition().duration(750)
                  .attr("opacity", 1)

                  .attr("transform", function() { return "rotate(" + computeTextRotation(e) + ")" })
                  .attr("x", function(d) { return y(d.y); });
              }
          });
      }

    d3.select(self.frameElement).style("height", height + "px");

    // Interpolate the scales!
    function arcTween(d) {
      var xd = d3.interpolate(x.domain(), [d.x, d.x + d.dx]),
          yd = d3.interpolate(y.domain(), [d.y, 1]),
          yr = d3.interpolate(y.range(), [d.y ? 20 : 0, radius]);
      return function(d, i) {
        return i
            ? function(t) { return arc(d); }
            : function(t) { x.domain(xd(t)); y.domain(yd(t)).range(yr(t)); return arc(d); };
      };
    }

    function computeTextRotation(d) {
      return (x(d.x + d.dx / 2) - Math.PI / 2) / Math.PI * 180;
    }
  });
}

extension_Init();
