import React, {PureComponent, ReactElement, MouseEvent} from 'react'
import classnames from 'classnames'
import calculateSize from 'calculate-size'

import {HANDLE_VERTICAL, HANDLE_HORIZONTAL} from 'src/shared/constants/index'

const NOOP = () => {}

interface Props {
  name?: string
  handleDisplay?: string
  handlePixels: number
  id: string
  size: number
  offset: number
  draggable: boolean
  orientation: string
  activeHandleID: string
  render: (visibility: string) => ReactElement<any>
  onHandleStartDrag: (id: string, e: MouseEvent<HTMLElement>) => void
  onDoubleClick: (id: string) => void
}

interface Style {
  width?: string
  height?: string
  display?: string
}

class Division extends PureComponent<Props> {
  public static defaultProps: Partial<Props> = {
    name: '',
    handleDisplay: 'visible',
  }

  private collapseThreshold: number = 0
  private ref: React.RefObject<HTMLDivElement>

  constructor(props) {
    super(props)
    this.ref = React.createRef<HTMLDivElement>()
  }

  public componentDidMount() {
    const {name} = this.props

    if (!name) {
      return 0
    }

    const {width} = calculateSize(name, {
      font: '"Roboto", Helvetica, Arial, Tahoma, Verdana, sans-serif',
      fontSize: '16px',
      fontWeight: '500',
    })
    const NAME_OFFSET = 66

    this.collapseThreshold = width + NAME_OFFSET
  }

  public render() {
    const {name, render, draggable} = this.props
    return (
      <div
        className={this.containerClass}
        style={this.containerStyle}
        ref={this.ref}
      >
        <div
          style={this.handleStyle}
          title={this.title}
          draggable={draggable}
          onDragStart={this.drag}
          className={this.handleClass}
          onDoubleClick={this.handleDoubleClick}
        >
          <div className={this.titleClass}>{name}</div>
        </div>
        <div className={this.contentsClass} style={this.contentStyle}>
          {name && <div className="threesizer--header" />}
          <div className="threesizer--body">{render(this.visibility)}</div>
        </div>
      </div>
    )
  }

  private get visibility(): string {
    if (this.props.size === 0) {
      return 'hidden'
    }

    return 'visible'
  }

  private get title(): string {
    return 'Drag to resize.\nDouble click to expand.'
  }

  private get contentStyle(): Style {
    if (this.props.orientation === HANDLE_HORIZONTAL) {
      return {
        height: `calc(100% - ${this.handlePixels}px)`,
      }
    }

    return {
      width: `calc(100% - ${this.handlePixels}px)`,
    }
  }

  private get handleStyle(): Style {
    const {handleDisplay: display, orientation, handlePixels} = this.props

    if (orientation === HANDLE_HORIZONTAL) {
      return {
        display,
        height: `${handlePixels}px`,
      }
    }

    return {
      display,
      width: `${handlePixels}px`,
    }
  }

  private get containerStyle(): Style {
    if (this.props.orientation === HANDLE_HORIZONTAL) {
      return {
        height: this.size,
      }
    }

    return {
      width: this.size,
    }
  }

  private get size(): string {
    const {size, offset} = this.props
    return `calc((100% - ${offset}px) * ${size} + ${this.handlePixels}px)`
  }

  private get handlePixels(): number {
    if (this.props.handleDisplay === 'none') {
      return 0
    }

    return this.props.handlePixels
  }

  private get containerClass(): string {
    const {orientation} = this.props
    const isAnyHandleBeingDragged = !!this.props.activeHandleID
    return classnames('threesizer--division', {
      dragging: isAnyHandleBeingDragged,
      vertical: orientation === HANDLE_VERTICAL,
      horizontal: orientation === HANDLE_HORIZONTAL,
    })
  }

  private get handleClass(): string {
    const {draggable, orientation} = this.props

    return classnames('threesizer--handle', {
      disabled: !draggable,
      dragging: this.isDragging,
      vertical: orientation === HANDLE_VERTICAL,
      horizontal: orientation === HANDLE_HORIZONTAL,
    })
  }

  private get contentsClass(): string {
    const {orientation, size} = this.props
    return classnames(`threesizer--contents ${orientation}`, {
      'no-shadows': !size,
    })
  }

  private get titleClass(): string {
    const {orientation} = this.props

    const collapsed = orientation === HANDLE_VERTICAL && this.isTitleObscured

    return classnames('threesizer--title', {
      'threesizer--collapsed': collapsed,
      vertical: orientation === HANDLE_VERTICAL,
      horizontal: orientation === HANDLE_HORIZONTAL,
    })
  }

  private get isTitleObscured(): boolean {
    if (this.props.size === 0) {
      return true
    }

    if (!this.ref || this.props.size >= 0.33) {
      return false
    }

    const {width} = this.ref.current.getBoundingClientRect()

    return width <= this.collapseThreshold
  }

  private get isDragging(): boolean {
    const {id, activeHandleID} = this.props
    return id === activeHandleID
  }

  private drag = e => {
    const {draggable, id} = this.props

    if (!draggable) {
      return NOOP
    }

    this.props.onHandleStartDrag(id, e)
  }

  private handleDoubleClick = (): void => {
    const {onDoubleClick, id} = this.props

    onDoubleClick(id)
  }
}

export default Division
