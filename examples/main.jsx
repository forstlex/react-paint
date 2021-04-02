/*eslint no-unused-vars: 0, no-console: 0*/

import React from 'react';
import {CompactPicker} from 'react-color';
import 'flexboxgrid';
import './main.css';
import AppBar from '@material-ui/core/AppBar';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import ExpandMore from '@material-ui/icons/ExpandMore';
import CardHeader from '@material-ui/core/CardHeader';
import GridListTile from '@material-ui/core/GridListTile';
import IconButton from '@material-ui/core/IconButton';
import MenuItem from '@material-ui/core/MenuItem';
import Button from '@material-ui/core/Button';
import Slider from '@material-ui/lab/Slider';
import TextField from '@material-ui/core/TextField';
import Switch from '@material-ui/core/Switch';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Collapse from '@material-ui/core/Collapse';
import {createMuiTheme, MuiThemeProvider} from '@material-ui/core/styles';
import color from '@material-ui/core/colors/blueGrey';

import UndoIcon from '@material-ui/icons/Undo';
import RedoIcon from '@material-ui/icons/Redo';
import DeleteIcon from '@material-ui/icons/Delete';
import SaveIcon from '@material-ui/icons/Save';
import ClearIcon from '@material-ui/icons/Clear';
import AddIcon from '@material-ui/icons/Add';
import CopyIcon from '@material-ui/icons/FileCopy';
import RemoveIcon from '@material-ui/icons/Remove';
import DownloadIcon from '@material-ui/icons/CloudDownload';
import ZoomInIcon from '@material-ui/icons/ZoomIn';
import ZoomOutIcon from '@material-ui/icons/ZoomOut';
import dataJson from './data.json';
import dataJsonControlled from './data.json.controlled';
import {PaintField, Tools} from '../src';
import dataUrl from './data.url';
import DropZone from 'react-dropzone';
import Toolbar from '@material-ui/core/Toolbar/Toolbar';
import Typography from '@material-ui/core/Typography/Typography';

const styles = {
  root: {
    padding: '3px',
    display: 'flex',
    flexWrap: 'wrap',
    margin: '10px 10px 5px 10px',
    justifyContent: 'space-around',
  },
  gridList: {
    width: '100%',
    overflowY: 'auto',
    marginBottom: '24px',
  },
  gridTile: {
    backgroundColor: '#fcfcfc',
  },
  appBar: {
    backgroundColor: '#333',
  },
  radioButton: {
    marginTop: '3px',
    marginBottom: '3px',
  },
  separator: {
    height: '42px',
    backgroundColor: 'white',
  },
  iconButton: {
    fill: 'white',
    width: '42px',
    height: '42px',
  },
  dropArea: {
    width: '100%',
    height: '64px',
    border: '2px dashed rgb(102, 102, 102)',
    borderStyle: 'dashed',
    borderRadius: '5px',
    textAlign: 'center',
    paddingTop: '20px',
  },
  activeStyle: {
    borderStyle: 'solid',
    backgroundColor: '#eee',
  },
  rejectStyle: {
    borderStyle: 'solid',
    backgroundColor: '#ffdddd',
  },
  card: {
    margin: '10px 10px 5px 0'
  }
};

/**
 * Helper function to manually fire an event
 *
 * @param el the element
 * @param etype the event type
 */
function eventFire(el, etype) {
  if (el.fireEvent) {
    el.fireEvent('on' + etype);
  } else {
    var evObj = document.createEvent('Events');
    evObj.initEvent(etype, true, false);
    el.dispatchEvent(evObj);
  }
}

class PaintFieldDemo extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      lineWidth: 10,
      lineColor: 'black',
      fillColor: '#68CCCA',
      backgroundColor: 'transparent',
      shadowWidth: 0,
      shadowOffset: 0,
      tool: Tools.Pencil,
      enableRemoveSelected: false,
      fillWithColor: false,
      fillWithBackgroundColor: false,
      drawings: [],
      canUndo: false,
      canRedo: false,
      controlledSize: false,
      paintWidth: 600,
      paintHeight: 600,
      gridon: true,
      originX: 'left',
      originY: 'top',
      imageUrl: 'https://files.gamebanana.com/img/ico/sprays/4ea2f4dad8d6f.png',
      expandTools: false,
      expandControls: false,
      expandColors: false,
      expandBack: false,
      expandImages: false,
      expandControlled: false,
      text: 'a text, cool!',
      enableCopyPaste: false,
    };

    
  }


  _selectTool = event => {
    this.setState({
      tool: event.target.value,
      enableRemoveSelected: event.target.value === Tools.Select,
      enableCopyPaste: event.target.value === Tools.Select
    });
  };

  _save = () => {
    let downloadLink = document.createElement('a');
        downloadLink.setAttribute('download', 'CanvasAsImage.png');
        const d = this._paint.toDataURL('image/png');
        let url = d.replace(/^data:image\/png/,'data:application/octet-stream');
        downloadLink.setAttribute('href', url);
        downloadLink.click();
  };

  _download = () => {
    console.save(JSON.stringify(this._paint.toJSON()), 'toDataJSON.txt');
  };

  _renderTile = (drawing, index) => {
    return (
      <GridListTile
        key={index}
        title="Canvas Image"
        actionPosition="left"
        titlePosition="top"
        titleBackground="linear-gradient(to bottom, rgba(0,0,0,0.7) 0%,rgba(0,0,0,0.3) 70%,rgba(0,0,0,0) 100%)"
        cols={1}
        rows={1}
        style={styles.gridTile}
        actionIcon={
          <IconButton onTouchTap={c => this._removeMe(index)}>
            <ClearIcon color="white"/>
          </IconButton>
        }>
        <img src={drawing}/>
      </GridListTile>
    );
  };

  _removeMe = index => {
    let drawings = this.state.drawings;
    drawings.splice(index, 1);
    this.setState({ drawings: drawings });
  };

  _undo = () => {
    this._paint.undo();
    this.setState({
      canUndo: this._paint.canUndo(),
      canRedo: this._paint.canRedo(),
    });
  };

  _redo = () => {
    this._paint.redo();
    this.setState({
      canUndo: this._paint.canUndo(),
      canRedo: this._paint.canRedo(),
    });
  };

 _switchGrid = () => {
    this.setState({ gridon: !this.state.gridon });
    this._paint.setBackgroundGrid(this.state.gridon);
  }

  _switchBackgroundColor = () => {
    this.setState({fillWithBackgroundColor: !this.state.fillWithBackgroundColor});
  };
  
  _clear = () => {
    this._paint.clear();
    this._paint.setBackgroundGrid(!this.state.gridon);
    this.setState({
      controlledValue: null,
      backgroundColor: 'transparent',
      fillWithBackgroundColor: false,
      canUndo: this._paint.canUndo(),
      canRedo: this._paint.canRedo(),
    });
  };

  _removeSelected = () => {
    this._paint.removeSelected()
  };

  _onPaintChange = () => {
    let prev = this.state.canUndo;
    let now = this._paint.canUndo();
    if (prev !== now) {
      this.setState({ canUndo: now });
    }
  };

  

  _onBackgroundImageDrop = (accepted /*, rejected*/) => {
    if (accepted && accepted.length > 0) {
      let paint = this._paint;
      let reader = new FileReader();
      let { gridon, originX, originY } = this.state;
      reader.addEventListener(
        'load',
        () =>
          paint.setBackgroundFromDataUrl(reader.result, {
            gridon: gridon,
            originX: originX,
            originY: originY,
          }),
        false,
      );
      reader.readAsDataURL(accepted[0]);
    }
  };

  _addText = () => this._paint.addText(this.state.text);

  componentDidMount = () => {
    (function(console) {
      console.save = function(data, filename) {
        if (!data) {
          console.error('Console.save: No data');
          return;
        }
        if (!filename) filename = 'console.json';
        if (typeof data === 'object') {
          data = JSON.stringify(data, undefined, 4);
        }
        var blob = new Blob([data], { type: 'text/json' }),
          e = document.createEvent('MouseEvents'),
          a = document.createElement('a');
        a.download = filename;
        a.href = window.URL.createObjectURL(blob);
        a.dataset.downloadurl = ['text/json', a.download, a.href].join(':');
        e.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
        a.dispatchEvent(e);
//        setBackgroundFromDataUrl('C:\MERN\react-paint-master\grid-png-43559.png');
      };
    })(console);
    
  };

  render = () => {
    let { controlledValue } = this.state;
    const theme = createMuiTheme({
      typography: {
        useNextVariants: true,
      },
      palette: {
        primary: { main: color[500] }, // Purple and green play nicely together.
        secondary: { main: '#11cb5f' }, // This is just green.A700 as hex.
      },
    });
    return (
      <MuiThemeProvider theme={theme}>
        <div className="row">
          <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
            <AppBar title="paint Tool" position="static" style={styles.appBar}>
              <Toolbar>
                <Typography variant="h6" color="inherit" style={{ flexGrow: 1 }}>Paint Tool</Typography>
                <IconButton
                  color="primary"
                  disabled={!this.state.canUndo}
                  onClick={this._undo}>
                  <UndoIcon/>
                </IconButton>
                <IconButton
                  color="primary"
                  disabled={!this.state.canRedo}
                  onClick={this._redo}>
                  <RedoIcon/>
                </IconButton>
                <IconButton
                  color="primary"
                  onClick={this._save}>
                  <SaveIcon/>
                </IconButton>
                <IconButton
                  color="primary"
                  onClick={this._download}>
                  <DownloadIcon/>
                </IconButton>
                <IconButton
                  color="primary"
                  onClick={this._clear}>
                  <DeleteIcon/>
                </IconButton>
              </Toolbar>
            </AppBar>
          </div>
        </div>
        <div className="row">
          <div className="col-xs-7 col-sm-7 col-md-9 col-lg-9" tabIndex="0" onKeyDown={(e) => {
            if (e.keyCode == 46)
            this._removeSelected()
          }}>

            <PaintField
              name="paint"
              className="canvas-area"
              ref={c => (this._paint = c)}
              lineColor={this.state.lineColor}
              lineWidth={this.state.lineWidth}
              fillColor={
                this.state.fillWithColor
                  ? this.state.fillColor
                  : 'transparent'
              }
              backgroundColor={
                this.state.fillWithBackgroundColor
                  ? this.state.backgroundColor
                  : 'transparent'
              }
              
              width={
                this.state.controlledSize ? this.state.paintWidth : null
              }
              height={
                this.state.controlledSize ? this.state.paintHeight : null
              }
              defaultValue={dataJson}
              value={controlledValue}
              forceValue
              onChange={this._onPaintChange}
              tool={this.state.tool}
            />
            
          </div>
          <div className="col-xs-5 col-sm-5 col-md-3 col-lg-3">
            <Card style={styles.card}>
              <CardHeader
                title="Tools"
                subheader="Available tools"
                action={
                  <IconButton
                    onClick={(e) => this.setState({ expandTools: !this.state.expandTools })}>
                    <ExpandMore/>
                  </IconButton>
                }/>
              <Collapse in={this.state.expandTools}>
                <CardContent>
                  <div className="row">
                    <div className="col-lg-12">
                      <TextField
                        select={true}
                        label="Canvas Tool"
                        value={this.state.tool}
                        onChange={this._selectTool}
                        helperText="Please select Canvas Tool">
                        <MenuItem value={Tools.Select} key="Select">Select</MenuItem>
                        <MenuItem value={Tools.Pencil} key="Pencil">Pencil</MenuItem>
                        <MenuItem value={Tools.Eraser} key="Eraser">Eraser</MenuItem>
                        <MenuItem value={Tools.Line} key="Line">Line</MenuItem>
                        <MenuItem value={Tools.Arrow} key="Arrow">Arrow</MenuItem>
                        <MenuItem value={Tools.Rectangle} key="Rectangle">Rectangle</MenuItem>
                        <MenuItem value={Tools.Circle} key="Circle">Circle</MenuItem>
                        <MenuItem value={Tools.Pan} key="Pan">Pan</MenuItem>
                        <MenuItem value={Tools.Highlighter} key="Highlighter">Highlighter</MenuItem>
                        <MenuItem value={Tools.RectangleLabel} key="RectangleLabel">RectangleLabel</MenuItem>
                      </TextField>
                    </div>
                  </div>
                  <br/>
                  <br/>
                  <Typography id="slider">Brush Thickness</Typography>
                  <Slider
                    step={1} min={0} max={100}
                    aria-labelledby="slider"
                    value={this.state.lineWidth}
                    
                    onChange={(e, v) =>
                      this.setState({ lineWidth: v })
                    }
                  />
                  <br/>
                  <div className="row">
                    <div className="col-lg-7">
                      <TextField
                        label='Text'
                        helperText='Add text to Paint'
                        onChange={(e) => this.setState({ text: e.target.value })}
                        value={this.state.text}/>
                    </div>
                    <div className="col-lg-3">
                      <IconButton
                        color="primary"
                        onClick={this._addText}>
                        <AddIcon/>
                      </IconButton>
                    </div>
                  </div>
                </CardContent>
              </Collapse>
            </Card>
            <Card style={styles.card}>
              <CardHeader
                title="Colors"
                subheader="Put some color on your drawing"
                action={
                  <IconButton
                    onClick={(e) => this.setState({ expandColors: !this.state.expandColors })}>
                    <ExpandMore/>
                  </IconButton>
                }/>
              <Collapse in={this.state.expandColors}>
                <CardContent>
                  <label htmlFor='lineColor'>Line</label>
                  <br/>
                  <CompactPicker
                    id='lineColor' color={this.state.lineColor}
                    onChange={(color) => this.setState({ lineColor: color.hex })}/>
                  <br/>
                  <br/>
                  <label htmlFor='lineColor'>Fill</label>
                  <br/>
                  <CompactPicker
                    color={this.state.fillColor}
                    onChange={(color) => this.setState({ fillColor: color.hex })}/>
                  <br/>
                  <br/>
                  <FormControlLabel
                    control={
                      <Switch
                        value={this.state.fillWithColor}
                        onChange={(e) => this.setState({ fillWithColor: !this.state.fillWithColor })}/>
                    }
                    label="Fill"
                  />
                  <br/>
                  <FormControlLabel
                    label="Set Grid"
                    control={
                      <Switch
                        value={this.state.gridon}
                        onChange={this._switchGrid}/>
                    }/>

                </CardContent>
              </Collapse>
            </Card>
          </div>
        </div>
        <div style={{ width: 0 }}>
          <div className="col-xs-7 col-sm-7 col-md-9 col-lg-9">
            {/* Paint area */}

            <div className="col-xs-5 col-sm-5 col-md-3 col-lg-3">


            </div>
          </div>

        </div>
      </MuiThemeProvider>
    );
  };
}

export default PaintFieldDemo;
