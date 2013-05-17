function swipeView(theParent) {

  var self          = this;
  var root          = document.querySelector(theParent);
  var leaves        = document.querySelectorAll(theParent + '>*');
  var prevbutton    = document.querySelector('.prevbutton');
  var nextbutton    = document.querySelector('.nextbutton');
  var currentID     = 0;
  var root_width    = 0;
  var leaf_count    = leaves.length;
  var leaf_current  = null;
  var leaf_next     = null;
  var leaf_prev     = null;
  var footerDOM;

  self.init = function() {
    if (leaves.length < 1) {
      return;
    }
    checkParentHeight();
    setRootWidth();
    createFooter();
    setCurrent(currentID);
    window.addEventListener('resize',
      function(){
        checkParentHeight();
        setRootWidth();
      });
  
    function checkParentHeight () {
      var parent = root.parentNode;
      var ratio = .666;
      console.log(window.orientation);
      if (window.orientation === 90 || window.orientation === -90) {
        ratio = .333;
      }
      ratio = .333;
      var parentWidth = parseInt(getComputedStyle(parent).width, 10);
      var parentHeight = parseInt(getComputedStyle(parent).height, 10);
      parent.style.height = parentWidth*ratio + 40 +  'px';
    }
    
    function createFooter () {
      footerDOM = document.createElement('ul');
      var i;
      for (i = 0; i < leaf_count; i++) {
        var newLi = document.createElement('li');
        footerDOM.appendChild(newLi);
      }
      footerDOM.className= 'sv-footer hasCurrent';
      root.parentNode.appendChild(footerDOM);
    }
    
    function setFooter (index) {
      var i;
      for (i = 0; i < leaf_count; i++) {
        var footerDot = footerDOM.childNodes[i];
        if (footerDot.tagName = 'LI') {
          if (i === currentID) {
            footerDot.className = 'currentLeaf';
          } else {
            footerDot.className = '';
          }
        }
      }
    }
    
    function setRootWidth () {
      root_width = parseInt(getComputedStyle(root).width, 10);
    };
    
    function setCurrent (index) {
      var isForward = (index > currentID);
      if (index !== -1 && index !== leaf_count) {
        currentID = index;
        leaf_prev = leaves[currentID-1];
        leaf_current = leaves[currentID];
        leaf_next = leaves[currentID+1];
        
        var leaf_prev_prev = leaves[currentID-2];
        var leaf_next_next = leaves[currentID+2];
        
        if (leaf_prev_prev) {
          leaf_prev_prev.className = 'leaf';
        }
        
        if (leaf_next_next) {
          leaf_next_next.className = 'leaf';
        }
        
        if (leaf_prev) {
          leaf_prev.className = 'leaf prev';
        }
        
        leaf_current.className = 'leaf current';
        
        if (leaf_next) {
          leaf_next.className = 'leaf next';
        }
      } else if (index == -1 || index == leaf_count) {
        footerDOM.className= 'sv-footer';
        setTimeout(function () {
          footerDOM.className= 'sv-footer hasCurrent';
        }, 200)
      }
      writeStyle(isForward, 0);
      setFooter(currentID);
    }
    
    function writeStyle (forward, percent) {
      if(Modernizr.csstransforms3d) {
        leaf_current.style.webkitTransform = 'translate3d(' + percent + '%,0,0)';
        if (!(currentID === 0 && forward) && !(currentID === leaf_count-1 && !forward)) { leaf_current.style.opacity = 1 - Math.abs(percent/30) };
        if (forward) {
          if (leaf_prev) {
            leaf_prev.style.webkitTransform = 'translate3d(' + (percent - 30) + '%,0,0)';
            leaf_prev.style.opacity = Math.abs(percent/30);
          }
          if (leaf_next) {
            leaf_next.style.webkitTransform = '';
            leaf_next.style.opacity = '';
          }
        }
        if (!forward) {
          if (leaf_prev) {
            leaf_prev.style.webkitTransform = '';
            leaf_prev.style.opacity = '';
          }
          if (leaf_next) {
            leaf_next.style.webkitTransform = 'translate3d(' + (percent + 30) + '%,0,0)';
            leaf_next.style.opacity = Math.abs(percent/30);
          }
        }
      } else if(Modernizr.csstransforms) {
        leaf_current.style.webkitTransform = 'translate(' + percent + '%,0)';
        if (forward) {
          if (leaf_prev) {leaf_prev.style.webkitTransform = 'translate(' + (percent - 30) + '%,0)';}
          if (leaf_next) {leaf_next.style.webkitTransform = '';}
        }
        if (!forward) {
          if (leaf_prev) {leaf_prev.style.webkitTransform = '';}
          if (leaf_next) {leaf_next.style.webkitTransform = 'translate(' + (percent + 30) + '%,0)';}
        }
      } else {
        leaf_current.style.left = percent +'%';
        if (forward) {
          if (leaf_prev) {leaf_prev.style.left = (percent - 30) + '%';}
          if (leaf_next) {leaf_next.style.left = '';}
        }
        if (!forward) {
          if (leaf_prev) {leaf_prev.style.left = '';}
          if (leaf_next) {leaf_next.style.left = (percent + 30) + '%';}
        }
      }
    }
  
    function moveLeaf (percent) {
      var forward = false;
      if(percent>=0) {
        forward = true;
      }
      writeStyle (forward, percent);
    }
    
    function keyCommands (e) {
      e = window.event || e;
      if (e.which == 39) {
        next();
      }
      if (e.which == 37) {
        prev();
      }
    };
    
    document.onkeydown = keyCommands;
  
    function next (){return setCurrent(currentID+1)};
    function prev (){return setCurrent(currentID-1)};
    
    Hammer(root).on("dragstart", function (ev) {
      root.className = 'drag';
      if (ev.gesture.direction == Hammer.DIRECTION_RIGHT || ev.gesture.direction == Hammer.DIRECTION_LEFT) {
        ev.gesture.preventDefault();
        self.locked = false;
      }
    });
    
    Hammer(root).on("drag", function (ev) {
      if (self.locked === false) {
        var drag_offset = ((100/root_width)*ev.gesture.deltaX);
        drag_offset *= .3;
        if((currentID == 0 && ev.gesture.direction == Hammer.DIRECTION_RIGHT) ||
          (currentID == leaf_count-1 && ev.gesture.direction == Hammer.DIRECTION_LEFT)) {
          drag_offset;
        }
        moveLeaf(drag_offset);
      }
    });
    
    Hammer(root).on("release", function (ev) {
      root.className = '';
      if(Math.abs(ev.gesture.deltaX) > 70 && self.locked === false) {
        if(ev.gesture.direction == 'right') {
          prev();
        } else {
          next();
        }
      } else {
        setCurrent(currentID);
      }
      if (leaf_prev) { leaf_prev.style.opacity = ''}
      if (leaf_next) { leaf_next.style.opacity = ''}
      if (leaf_current) { leaf_current.style.opacity = ''}
      self.locked = true;
    });
    
    Hammer(root).on("pinch", function (ev) {
      ev.gesture.preventDefault();
    });
    
    Hammer(root).on("tap", function (ev) {
      ev.gesture.preventDefault();
      if (ev.gesture.center.pageX < root_width/6) {
        prev();
      } else if ((root_width - ev.gesture.center.pageX) < root_width/6) {
        next();
      }
    });
    
    Hammer(prevbutton).on("tap", function (ev) {
      ev.gesture.preventDefault();
      prev();
    });
    
    Hammer(nextbutton).on("tap", function (ev) {
      ev.gesture.preventDefault();
      next();
    });

  };

}
