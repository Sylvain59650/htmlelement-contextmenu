# htmlelement-contextmenu


<div style="display:inline">

[![build](https://travis-ci.org/Sylvain59650/htmlelement-contextmenu.png?branch=master)](https://travis-ci.org/Sylvain59650/htmlelement-contextmenu)
![version](https://img.shields.io/npm/v/htmlelement-contextmenu.svg)
![package](https://img.shields.io/github/package-json/v/Sylvain59650/htmlelement-contextmenu.svg)
![dependencies](https://img.shields.io/david/Sylvain59650/htmlelement-contextmenu.svg)
![minified](https://img.shields.io/bundlephobia/min/htmlelement-contextmenu.svg)
![linter](https://img.shields.io/badge/eslint-ok-blue.svg)
![tests](https://img.shields.io/badge/tests-passing-brightgreen.svg)
![license](https://img.shields.io/npm/l/htmlelement-contextmenu.svg)
[![hits](http://hits.dwyl.com/Sylvain59650/htmlelement-contextmenu.svg)](http://hits.dwyl.com/Sylvain59650/htmlelement-contextmenu)
</div>

 <div class="Note" style="color:orange;font-style:italic">
 
  The lastest version of this document is available on [Github > htmlelement-contextmenu](https://github.com/Sylvain59650/htmlelement-contextmenu/blob/master/README.md)
</div>

## Introduction

this class is used to create a context menu accessible by right-clicking on an html element. <br/>


- characteristics 
  - The menu can be controlled with the keyboard. 
  - The API allows to dynamically add / remove / activate / deactivate menu items
  - Add an icon or/and keyboard shortcut to each menu item
  - The menu design can be easily modified via the css
  - Several contextual menus can coexist on the same web page.
  - work on IE11, Firefox & Chrome 

## Installation

    npm install htmlelement-contextmenu --save

or

    yarn add htmlelement-contextmenu --save


## prerequisites for browser

    <script src="node_modules/htmlelement-contextmenu/distrib/htmlelement-contextmenu.min.js"></script>


## API
  - ContextMenu
    - constructor (menuInfo)
    - insertItem(menuItem)
    - removeItem(menuItem)
    - popup(x,y)

<table>
<tr><td>object menuItem {</td></tr>      
<tr><td> key: </td><td>html id of the menu item</td></tr>
<tr><td>label:</td><td>Text of menu item</td></tr> 
  <tr><td>      class:</td><td>Css class of menu item</td></tr> 
  <tr><td>      fn: </td><td>function to call when the menu item is selected</td></tr>
  <tr><td>      accesskey:</td><td>shortcut key to select the menu item</td></tr>
   <tr><td>     showing:</td><td>function call to determine the css class of menu item WHEN showing menu</td></tr>
   <tr><td>      disabled:</td><td>bool to active or inactive the menu item</td></tr>
<tr><td>}</td><td></td></tr>
</table>


<table>
<tr><td>object menuInfo {</td></tr>
<tr><td>menuId:</td><td>html id of the menu</td></tr>
<tr><td>targetId:</td><td>id of the html element on which the context menu should be created</td></tr>
<tr><td>showAccessKey:</td><td>bool to show shortcut in context menu</td></tr>
<tr><td>beforeShowing:</td><td>function called before showing context menu. This function can update items before showing</td></tr>
<tr><td>items:</td><td>array of menuItems</td></tr>
<tr><td>}</td><td></tr>
</table>


## usage

     <link rel="stylesheet" href="node_modules/htmlelement-contextmenu/distrib/htmlelement-contextmenu.min.css" />
    <script src="node_modules/htmlelement-contextmenu/distrib/htmlelement-contextmenu.min.js"></script>

     <div id="div1">right click here</div>
    <script>
    var menuInfo = {
      menuId: "menu1",
      targetId: "#div1",
      items: [{
        key: "cut",
        label: "cut",
        fn: () => console.log("cut")
      }, {
        label: "sep"
      }, {
        key: "copy",
        label: "Copy",
        fn: () => console.log("copy")
      }, {
        key: "paste",
        label: "Paste",
        showing: () => {
          let val = document.querySelector("#t1");
          return (val.value < 5) ? "cmDisabled" : "-cmDisabled";
        },
        fn: () => console.log("paste")
      }]
    };

    var menu = new ContextMenu(menuInfo);
    </script>


