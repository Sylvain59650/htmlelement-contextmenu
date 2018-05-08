window.isDef = function(value) {
  return (value !== null && typeof value !== "undefined");
}

window.CM = function(menuInfo) {

  const classNames = {
    menuItem: "cmItem",
    hover: "cmHover",
    disabled: "cmDisabled",
    visible: "cmVisible",
    notSelectable: "cmNoSelect",
    selectable: "cmSelect",
    icon: "cmIcon",
    separator: "cmSeparator"
  };

  function moveSelected(contextmenu, direction) {
    if (contextmenu.style.display === "block") {
      var menuItems = contextmenu.getElementsByClassName(classNames.selectable);
      if (contextmenu.selectedIndex !== -1) {
        menuItems[contextmenu.selectedIndex].classList.remove(classNames.hover);
      }
      contextmenu.selectedIndex += direction;
      if (contextmenu.selectedIndex === -1) {
        contextmenu.selectedIndex = menuItems.length - 1;
      } else if (contextmenu.selectedIndex >= menuItems.length) {
        contextmenu.selectedIndex = 0;
      }
      menuItems[contextmenu.selectedIndex].classList.add(classNames.hover);
    }
  };

  function onBeforeShow() {
    let i = 0;
    var menuItems = contextmenu.getElementsByClassName(classNames.menuItem);
    for (let item of menuInfo.items) {
      let show = "";
      if (item.showing) {
        show = item.showing();
      }
      if (show !== "") {
        if (show.indexOf("-") === 0) {
          show = show.substring(1);
          menuItems[i].classList.remove(show);
        } else {
          menuItems[i].classList.add(show);
        }
      }
      i++;
    }
  }

  var stopEvent = function(e) {
    e.preventDefault();
    e.stopImmediatePropagation();
  }

  var helpers = {
    menuOn: function(contextmenu) {
      contextmenu.style.display = "block";
      contextmenu.selectedIndex = 0;
    },
    menuOff: function(contextmenu) {
      contextmenu.style.display = "none";
    },

    keydownListener: function(contextmenu) {
      var self = this;
      window.addEventListener("keydown", function(e) {
        switch (e.keyCode) {
          case 27: // ESC Key
            self.menuOff(contextmenu);
            break;
          case 38: // Up arrow
            moveSelected(contextmenu, -1);
            break;
          case 40: // Down arrow
            moveSelected(contextmenu, 1);
            break;
          case 13: // Enter
            var menuItems = contextmenu.getElementsByClassName(classNames.selectable);
            var hovered = menuItems[contextmenu.selectedIndex];
            self.menuOff(contextmenu);
            hovered.click();
            break;
        }
      });
    },

    // Turn menu off if window is resized
    resizeListener: function(contextmenu) {
      var self = this;
      window.onresize = function() {
        self.menuOff(contextmenu);
      };
    },

    rightClickListener: function(contextmenu) {
      var self = this;
      contextmenu.addEventListener("mousedown", function(e) {
        stopEvent(e);
        if (e.button === 0 || e.button === 1 || e.button === 2) {
          self.menuOff(contextmenu);
          e.target.click();
        }
      });
    },

    documentClickListener: function() {
      var self = this;
      document.addEventListener("click", function() {
        self.menuOff(contextmenu);
      });
    },
    openContextMenuListener: function(element, contextmenu) {
      element.addEventListener("contextmenu", function(e) {
        stopEvent(e);
        onBeforeShow(contextmenu);
        helpers.menuOn(contextmenu);
        positionMenu.setMenuPosition(e, contextmenu);
      });
    }
  }


  var positionMenu = {
    getMousePosition: function(e) {
      var posx = 0;
      var posy = 0;

      if (!e) {
        e = window.event;
      }
      if (e.pageX || e.pageY) {
        posx = e.pageX;
        posy = e.pageY;
      } else if (e.clientX || e.clientY) {
        posx = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
        posy = e.clientY + document.body.scrollTop + document.documentElement.scrollTop;
      }

      return {
        x: posx,
        y: posy
      };
    },

    setMenuPosition: function(e, menu) {
      var clickCoords = this.getMousePosition(e);
      var menuWidth = menu.offsetWidth + 3;
      var menuHeight = menu.offsetHeight + 3;

      var windowWidth = window.innerWidth;
      var windowHeight = window.innerHeight;

      // X coordinates
      if ((windowWidth - clickCoords.x) < menuWidth) {
        menu.style.left = (windowWidth - menuWidth) + "px";
      } else {
        menu.style.left = clickCoords.x + "px";
      }

      // Y coordinates
      if ((windowHeight - clickCoords.y) < menuHeight) {
        menu.style.top = (windowHeight - menuHeight) + "px";
      } else {
        menu.style.top = clickCoords.y + "px";
      }
    }
  };



  var makeContextMenu = function(menuInfo) {
    var ul = document.createElement("ul");
    ul.id = menuInfo.menuId;
    ul.classList.add("contextmenu");
    ul.style.display = "none";
    if (menuInfo.items) {
      for (let i = 0; i < menuInfo.items.length; i++) {
        makeMenuItem(menuInfo.items[i], ul, i);
      }
    }
    return ul;
  };

  var makeMenuItem = function(option, ul, nth) {
    var li = document.createElement("li");
    li.classList.add(classNames.menuItem);
    if (option.label === "sep") {
      li.classList.add(classNames.separator);
      li.classList.add(classNames.notSelectable);
    } else {
      li.innerText = option.label;
      li.id = ul.id + "-" + String(nth);
      li.classList.add(classNames.selectable);
      if (window.isDef(option.fn)) {
        li.onclick = option.fn;
      }
    }
    ul.appendChild(li);
  };


  var target = document.querySelector(menuInfo.targetId);
  var contextmenu = makeContextMenu(menuInfo);
  document.body.appendChild(contextmenu);
  helpers.keydownListener(contextmenu);
  helpers.resizeListener(contextmenu);
  helpers.rightClickListener(contextmenu);
  helpers.documentClickListener();
  helpers.openContextMenuListener(target, contextmenu);
};