import React from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'

import RefreshingGraph from 'src/shared/components/RefreshingGraph'
import buildQueries from 'utils/buildQueriesForGraphs'
import VisualizationName from 'src/dashboards/components/VisualizationName'

import {getCellTypeColors} from 'src/dashboards/constants/cellEditor'
import {colorsStringSchema, colorsNumberSchema} from 'shared/schemas'

const DashVisualization = (
  {
    axes,
    type,
    templates,
    timeRange,
    lineColors,
    autoRefresh,
    gaugeColors,
    queryConfigs,
    editQueryStatus,
    resizerTopHeight,
    staticLegend,
    thresholdsListColors,
    tableOptions,
    timeFormat,
    decimalPlaces,
    fieldOptions,
    isInCEO,
  },
  {
    source: {
      links: {proxy},
    },
  }
) => {
  const colors = getCellTypeColors({
    cellType: type,
    gaugeColors,
    thresholdsListColors,
    lineColors,
  })

  return (
    <div className="graph">
      <VisualizationName />
      <div className="graph-container">
        <RefreshingGraph
          colors={colors}
          axes={axes}
          type={type}
          tableOptions={tableOptions}
          queries={buildQueries(proxy, queryConfigs, timeRange)}
          templates={templates}
          autoRefresh={autoRefresh}
          editQueryStatus={editQueryStatus}
          resizerTopHeight={resizerTopHeight}
          staticLegend={staticLegend}
          timeFormat={timeFormat}
          decimalPlaces={decimalPlaces}
          fieldOptions={fieldOptions}
          isInCEO={isInCEO}
        />
      </div>
    </div>
  )
}

const {arrayOf, bool, func, number, shape, string} = PropTypes

DashVisualization.propTypes = {
  type: string.isRequired,
  autoRefresh: number.isRequired,
  templates: arrayOf(shape()),
  timeRange: shape({
    upper: string,
    lower: string,
  }).isRequired,
  queryConfigs: arrayOf(shape({})).isRequired,
  editQueryStatus: func.isRequired,
  axes: shape({
    y: shape({
      bounds: arrayOf(string),
    }),
  }),
  tableOptions: shape({}),
  timeFormat: string.isRequired,
  decimalPlaces: shape({
    isEnforced: bool,
    digits: number,
  }),
  fieldOptions: arrayOf(
    shape({
      internalName: string.isRequired,
      displayName: string.isRequired,
      visible: bool.isRequired,
    })
  ),
  resizerTopHeight: number,
  thresholdsListColors: colorsNumberSchema,
  gaugeColors: colorsNumberSchema,
  lineColors: colorsStringSchema,
  staticLegend: bool,
  isInCEO: bool,
}

DashVisualization.contextTypes = {
  source: PropTypes.shape({
    links: PropTypes.shape({
      proxy: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
}

const mapStateToProps = ({
  cellEditorOverlay: {
    thresholdsListColors,
    gaugeColors,
    lineColors,
    cell: {type, axes, tableOptions, fieldOptions, timeFormat, decimalPlaces},
  },
}) => ({
  gaugeColors,
  thresholdsListColors,
  lineColors,
  type,
  axes,
  tableOptions,
  fieldOptions,
  timeFormat,
  decimalPlaces,
})

export default connect(mapStateToProps, null)(DashVisualization)
