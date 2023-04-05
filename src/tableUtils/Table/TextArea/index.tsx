/**
 * <TextareaAutosize />
 */

import React from 'react';
import PropTypes from 'prop-types';
import calculateNodeHeight, { purgeCache } from './calculateNodeHeight';
import uid from './uid';

const noop = () => {};



export default class TextareaAutosize extends React.Component {
  static propTypes = {
    value: PropTypes.string,
    onChange: PropTypes.func,
    onHeightChange: PropTypes.func,
    useCacheForDOMMeasurements: PropTypes.bool,
    minRows: PropTypes.number,
    maxRows: PropTypes.number,
    inputRef: PropTypes.func,
  };

  static defaultProps = {
    onChange: noop,
    onHeightChange: noop,
    useCacheForDOMMeasurements: false,
  };

  _resizeLock = false;
  _uid:any
  _controlled:any
 state: any
 _resizeListener:any
 _onNextFrameActionId:any
 props: any
 _rootDOMNode:any
 rowCount:any
  constructor(props:any) {
    super(props);
    this.state = {
      height: (props.style && props.style.height) || 0,
      minHeight: -Infinity,
      maxHeight: Infinity,
    }

    this._uid  = uid();
    this._controlled = typeof props.value === 'string';
  }

  render() {
    let {
      minRows: _minRows,
      maxRows: _maxRows,
      onHeightChange: _onHeightChange,
      useCacheForDOMMeasurements: _useCacheForDOMMeasurements,
      inputRef: _inputRef,
      ...props
    }:any = this.props;

    props.style = {
      ...props.style,
      height: this.state.height,
    };

    let maxHeight = Math.max(
      props.style.maxHeight || Infinity,
      this.state.maxHeight
    );

    if (maxHeight < this.state.height) {
      props.style.overflow = 'hidden';
    }

    return (
      <textarea
        {...props}
        onChange={this._onChange}
        ref={this._onRootDOMNode}
      />
    );
  }

  componentDidMount() {
    this._resizeComponent();
    // Working around Firefox bug which runs resize listeners even when other JS is running at the same moment
    // causing competing rerenders (due to setState in the listener) in React.
    // More can be found here - facebook/react#6324
    this._resizeListener = () => {
      if (this._resizeLock) {
        return;
      }
      this._resizeLock = true;
      this._resizeComponent(() => (this._resizeLock = false));
    };
    window.addEventListener('resize', this._resizeListener);
  }

  componentWillReceiveProps() {
    // this._clearNextFrame();
    // this._onNextFrameActionId = onNextFrame(() => this._resizeComponent());
  }

  componentDidUpdate(prevProps:any, prevState:any) {
    if (this.state.height !== prevState.height) {
      this.props.onHeightChange(this.state.height, this);
    }
  }

  componentWillUnmount() {
    this._clearNextFrame();
    window.removeEventListener('resize', this._resizeListener);
    purgeCache(this._uid);
  }

  _clearNextFrame() {
    // clearNextFrameAction(this._onNextFrameActionId);
  }

  _onRootDOMNode = (node:any) => {
    this._rootDOMNode = node;

    if (this.props.inputRef) {
      this.props.inputRef(node);
    }
  };

  _onChange = (event:any) => {
    if (!this._controlled) {
      this._resizeComponent();
    }
    this.props.onChange(event);
  };

  _resizeComponent = (callback = noop) => {
    if (typeof this._rootDOMNode === 'undefined') {
      callback();
      return;
    }

    const nodeHeight = calculateNodeHeight(
      this._rootDOMNode,
      this._uid,
      this.props.useCacheForDOMMeasurements,
      this.props.minRows,
      this.props.maxRows
    )

    if (nodeHeight === null) {
      callback();
      return;
    }

    const { height, minHeight, maxHeight, rowCount } = nodeHeight;

    this.rowCount = rowCount;

    if (
      this.state.height !== height ||
      this.state.minHeight !== minHeight ||
      this.state.maxHeight !== maxHeight
    ) {
      this.setState({ height, minHeight, maxHeight }, callback);
      return;
    }

    callback();
  };
}