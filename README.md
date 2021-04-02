# react-paint

[![GitHub release][github-image]][github-url]
[![NPM release][npm-image]][npm-url]
[![NPM downloads][downloads-image]][downloads-url]
[![Build status][travis-image]][travis-url]

A Paint tool for React based applications, backed-up by [FabricJS](http://fabricjs.com/)

### Source installation

In order to build from source, read the [relevant instructions](http://fabricjs.com/fabric-intro-part-4#node) first. 

Tested with node versions 6,7,8.

## Usage

Import the relevant PaintField component and use it, you can find more on the examples folder of the project

```javascript
import {PaintField, Tools} from 'react-paint';

class PaintFieldDemo extends React.Component {
     render() {
        return (
            <PaintField width='1024px' 
                         height='768px' 
                         tool={Tools.Pencil} 
                         lineColor='black'
                         lineWidth={3}/>
        )
     }
}

```
Configuration Options

| Option  	        | Type                  | Default 	    | Description  	                                                    |
|---                |---    	            |---	        |---                                                                |
| tool              | Enumeration (string)  | pencil        | The tool to use, can be select, pencil, circle, rectangle, pan    |
| lineColor         | String                | black         | The color of the line   	                                        |
| lineWidth         | Number                | 1             | The width of the line                                             | 
| fillColor         | String                | transparent   | The fill color (hex format) of the shape when applicable (e.g. circle) |
| backgroundColor   | String                | transparent   | The the background color of the paint in hex or rgba             |
| undoSteps         | Number                | 15            | number of undo/redo steps to maintain                             |
| imageFormat       | String                | png           | image format when calling toDataURL, can be png or jpeg           | 
| width             | Number                | No Value(null)| Set/control the canvas width, if left empty the paint will scale to parent element |
| height            | Number                | 512           | Set/control the canvas height, if left empty the paint will take a reasonable default height |
| value             | JSON                  |               | Property to utilize and handle the paint data as controlled component |
| defaultValue      | JSON                  |               | Default initial data, to load. If value is set then value will be loaded instead |
| widthCorrection   | Number                | 2             | Specify some width correction which will be applied on resize of canvas, this will help to correct some possible border on the canvas style |
| heightCorrection  | Number                | 0             | Specify some height correction which will be applied on resize of canvas, this will help to correct some possible border on the canvas style | 


Available tools

| Tool              | Description |
|---                |---          |
| Pencil            | Free drawing pencil |
| Line              | Gives you the ability to draw lines |
| Rectangle         | Create rectangles |
| Circle            | Create circles |
| Rectangle         | Create Rectangles |
| Select            | Disables drawing and gives you the ability to modify existing elements in the canvas |
| Pan               | Disables drawing and gives you the ability to move the complete canvas at will, useful to adjust the canvas when zooming in or out


## Examples

The project includes a webpack server for running the examples, just run:

```sh
git clone https://github.com/kirill-ui/react-paint.git
yarn install
npm start
```

and navigate to http://localhost:23000

## License

MIT, do remember to add a reference if you find it useful :)

[warning-image]: /docs/img/warning.png
[idea-image]: /docs/img/idea.png
[github-image]: https://img.shields.io/github/release/kirill-ui/react-paint.svg
[github-url]: https://github.com/kirill-ui/react-paint/releases
[npm-image]: https://img.shields.io/npm/v/react-paint.svg
[npm-url]: https://www.npmjs.com/package/react-paint
[downloads-image]: https://img.shields.io/npm/dm/react-paint.svg
[downloads-url]: https://www.npmjs.com/package/react-paint
[travis-image]: https://img.shields.io/travis/kirill-ui/react-paint.svg
[travis-url]: https://travis-ci.org/kirill-ui/react-paint
