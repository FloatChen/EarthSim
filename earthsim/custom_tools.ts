import * as p from "core/properties"
import {ActionTool, ActionToolView} from "models/tools/actions/action_tool"
import {ColumnDataSource} from "models/sources/column_data_source"
import {copy} from "core/util/array"

export class CheckpointToolView extends ActionToolView {
  model: CheckpointTool

  doit(): void {
    for (var source of this.model.sources) {
      if (source.buffer == undefined) { source.buffer = [] }
      let data_copy = {};
      for (const key in source.data) {
        const column = source.data[key];
        const new_column = []
        for (const arr of column) {
          if (Array.isArray(arr) || (ArrayBuffer.isView(arr))) {
            new_column.push(copy(arr))
          } else {
            new_column.push(arr)
          }
        }
        data_copy[key] = new_column;
      }
      source.buffer.push(data_copy)
    }
  }
}

export namespace CheckpointTool {
  export interface Attrs extends ActionTool.Attrs {}

  export interface Props extends ActionTool.Props {}
}

export interface CheckpointTool extends CheckpointTool.Attrs {}

export class CheckpointTool extends ActionTool {
  properties: CheckpointTool.Props
  sources: ColumnDataSource[]

  constructor(attrs?: Partial<CheckpointTool.Attrs>) {
    super(attrs)
  }

  static initClass(): void {
    this.prototype.type = "CheckpointTool"
    this.prototype.default_view = CheckpointToolView

    this.define({
      sources: [ p.Array, [] ],
    })
  }

  tool_name = "Checkpoint"
  icon = "bk-tool-icon-save"
}
CheckpointTool.initClass()

export class RestoreToolView extends ActionToolView {
  model: RestoreTool

  doit(): void {
    for (var source of this.model.sources) {
      if ((source.buffer == undefined) || (source.buffer.length == 0)) { continue; }
      source.data = source.buffer.pop();
      source.change.emit();
      source.properties.data.change.emit();
    }
  }
}

export namespace RestoreTool {
  export interface Attrs extends ActionTool.Attrs {}

  export interface Props extends ActionTool.Props {}
}

export interface RestoreTool extends RestoreTool.Attrs {}

export class RestoreTool extends ActionTool {
  properties: RestoreTool.Props
  sources: ColumnDataSource[]

  constructor(attrs?: Partial<RestoreTool.Attrs>) {
    super(attrs)
  }

  static initClass(): void {
    this.prototype.type = "RestoreTool"
    this.prototype.default_view = RestoreToolView

    this.define({
      sources: [ p.Array, [] ],
    })
  }

  tool_name = "Restore"
  icon = "bk-tool-icon-undo"
}

RestoreTool.initClass()


export class ClearToolView extends ActionToolView {
  model: ClearTool

  doit(): void {
    for (var source of this.model.sources) {
      for (const column in source.data) {
        source.data[column] = []
      }
      source.change.emit();
      source.properties.data.change.emit();
    }
  }
}

export namespace ClearTool {
  export interface Attrs extends ActionTool.Attrs {}

  export interface Props extends ActionTool.Props {}
}

export interface ClearTool extends ClearTool.Attrs {}

export class ClearTool extends ActionTool {
  properties: ClearTool.Props
  sources: ColumnDataSource[]

  constructor(attrs?: Partial<ClearTool.Attrs>) {
    super(attrs)
  }

  static initClass(): void {
    this.prototype.type = "ClearTool"
    this.prototype.default_view = ClearToolView

    this.define({
      sources: [ p.Array, [] ],
    })
  }

  tool_name = "Clear data"
  icon = "bk-tool-icon-reset"
}

ClearTool.initClass()
