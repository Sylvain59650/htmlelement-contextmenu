window.isDef = function(value) {
  return (value !== null && typeof value !== "undefined");
}
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

const shortcutPrefixes = {
  win_msie: "Alt+",
  win_mozilla: "Alt+Shift+",
  win_chrome: "Alt+",
  win_safari: "",
  win_opera: ""
};

/* global webBrowserDetection */

class ContextMenu {



  constructor(menuInfo) {
    this.__menuInfo = menuInfo;
    this.target = document.querySelector(menuInfo.targetId);
    this.makeContextMenu();
    document.body.appendChild(this.contextmenu);
    this.registerListeners();
    this.browser = webBrowserDetection();
    this.browserKey = this.browser.platform + "_" + this.browser.name;
  }

  menuOn() {
    this.contextmenu.style.display = "block";
    this.contextmenu.selectedIndex = 0;
  }

  menuOff() {
    this.contextmenu.style.display = "none";
  }

  menuInfo() {
    return this.__menuInfo;
  }

  stopEvent(e) {
    e.preventDefault();
    e.stopImmediatePropagation();
  }


  moveSelected(direction) {
    var contextmenu = this.contextmenu;
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
  }

  popup(x, y) {
    let self = this;
    self.onBeforeShow();
    self.menuOn();
    self.setMenuPosition({ x: x, y: y });
  }

  registerListeners() {
    var self = this;
    window.onresize = function() {
      self.menuOff();
    };

    this.contextmenu.addEventListener("mousedown", function(e) {
      self.stopEvent(e);
      if (e.button === 0 || e.button === 1 || e.button === 2) {
        self.menuOff();
        e.target.click();
      }
    });

    document.addEventListener("click", function() {
      self.menuOff();
    });

    this.target.addEventListener("contextmenu", function(e) {
      self.stopEvent(e);
      self.onBeforeShow();
      self.menuOn();
      var pos = self.getMousePosition(e);
      self.setMenuPosition(pos);
    });

    window.addEventListener("keydown", function(e) {
      switch (e.keyCode) {
        case 27: // ESC Key
          self.menuOff();
          break;
        case 38: // Up arrow
          self.moveSelected(-1);
          break;
        case 40: // Down arrow
          self.moveSelected(1);
          break;
        case 13: // Enter
          var menuItems = self.contextmenu.getElementsByClassName(classNames.selectable);
          var hovered = menuItems[self.contextmenu.selectedIndex];
          self.menuOff();
          hovered.click();
          break;
      }
    });
  }


  getMousePosition(e) {
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
  }

  setMenuPosition(pos) {
    var menuWidth = this.contextmenu.offsetWidth + 3;
    var menuHeight = this.contextmenu.offsetHeight + 3;
    var windowWidth = window.innerWidth;
    var windowHeight = window.innerHeight;
    if ((windowWidth - pos.x) < menuWidth) {
      this.contextmenu.style.left = (windowWidth - menuWidth - 3) + "px";
    } else {
      this.contextmenu.style.left = pos.x + "px";
    }
    if ((windowHeight - pos.y) < menuHeight) {
      this.contextmenu.style.top = (windowHeight - menuHeight + 3) + "px";
    } else {
      this.contextmenu.style.top = (pos.y + 3) + "px";
    }
  }


  onBeforeShow() {
    if (window.isDef(this.__menuInfo.beforeShowing)) {
      this.__menuInfo.beforeShowing();
    }
    let i = 0;
    var menuItems = this.contextmenu.getElementsByClassName(classNames.menuItem);
    for (let item of this.__menuInfo.items) {
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
    this.redrawItems();
  }


  insertItem(menuItem, position) {
    if (!window.isDef(position) || position >= this.__menuInfo.items.length) {
      this.__menuInfo.items.push(menuItem);
    } else {
      this.__menuInfo.items.splice(position, 0, menuItem);
    }
    this.redrawItems();
  }

  removeItem(menuItem) {
    let index = menuItem.find(x => x === menuItem.id);
    this.__menuInfo.items.splice(index, 1);
  }



  redrawItems() {
    this.contextmenu.innerHTML = "";
    if (this.__menuInfo.items) {
      for (let i = 0; i < this.__menuInfo.items.length; i++) {
        this.makeMenuItem(this.__menuInfo.items[i], i);
      }
    }
  }

  makeContextMenu() {
    this.contextmenu = document.createElement("ul");
    this.contextmenu.id = this.__menuInfo.menuId;
    this.contextmenu.classList.add("contextmenu");
    this.contextmenu.style.display = "none";
    this.redrawItems();
  }

  makeMenuItem(option, nth) {
    var li = document.createElement("li");
    li.classList.add(classNames.menuItem);
    if (option.label === "sep") {
      li.classList.add(classNames.separator);
      li.classList.add(classNames.notSelectable);
    } else {
      if (option.html) {
        li.innerHTML = option.html();
      } else {
        li.innerText = option.label;
      }
      li.id = this.contextmenu.id + "-" + String(nth);
      if (option.accesskey && !option.disabled) {
        li.setAttribute("accesskey", option.accesskey);
        if (this.__menuInfo.showAccessKey) {
          let sc = document.createElement("span");
          sc.classList.add("contextmenu-shortcut");
          let tmp = shortcutPrefixes[this.browserKey];
          if (!window.isDef(tmp)) {
            tmp = "";
          }
          sc.innerText = tmp + option.accesskey.toUpperCase();
          li.appendChild(sc);
        }
      }
      if (option.class) {
        let classes = option.class.split(" ");
        for (let cl of classes) {
          li.classList.add(cl);
        }
      }
      if (window.isDef(option.disabled) && option.disabled) {
        li.classList.add(classNames.disabled);
        li.classList.remove(classNames.selectable);
      } else {
        li.classList.remove(classNames.disabled);
        li.classList.add(classNames.selectable);
        if (window.isDef(option.fn) && !window.isDef(option.html)) {
          li.onclick = option.fn;
        }
      }

    }
    this.contextmenu.appendChild(li);
  }

}