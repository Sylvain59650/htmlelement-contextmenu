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

## Installation

    npm install htmlelement-contextmenu --save

or

    yarn add htmlelement-contextmenu --save


## prerequisites

### for browser

 
    <script src="node_modules/htmlelement-contextmenu/distrib/htmlelement-contextmenu.min.js"></script>

## usage

     <link rel="stylesheet" href="htmlelement-contextmenu.min.css" />
    <script src="htmlelement-contextmenu.min.js"></script>

     <div id="div1">right click here</div>
    <script>
    var menu = {
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

    CM(menu);
    </script>


