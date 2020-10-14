import React, { Component } from "react";

import MyTableCell from "./MyTableCell";
import { TableHead } from "@material-ui/core";
import {
  Grid,
  Table,
  Toolbar,
  SearchPanel,
  TableHeaderRow,
  PagingPanel,
  TableColumnResizing
} from "@devexpress/dx-react-grid-material-ui";
import {
  SearchState,
  IntegratedFiltering,
  PagingState,
  IntegratedPaging,
  SortingState,
  IntegratedSorting
} from "@devexpress/dx-react-grid";

class MyTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      defaultColumnWidths: [
        { columnName: "name", width: 250 },
        {
          columnName: "skillname",
          width: 175
        },
        {
          columnName: "proficiency",
          width: 250
        },
        {
          columnName: "subscription",
          width: 200
        },
        {
          columnName: "action",
          width: 150
        }
      ]
    };
  }

  render() {
    return (
      <div>
        <Grid rows={this.props.data} columns={this.props.columns}>
          <SortingState
            defaultSorting={[
              { columnName: "subscription", direction: "desc" },
              { columnName: "skillname", direction: "asc" },
              { columnName: "name", direction: "asc" }
            ]}
          />
          <IntegratedSorting />
          <SearchState />
          <IntegratedFiltering />
          <PagingState defaultCurrentPage={0} pageSize={1000} />
          <IntegratedPaging />
          <Table />

          {/* <Table cellComponent={MyTableCell} /> */}
          <TableColumnResizing
            defaultColumnWidths={this.state.defaultColumnWidths}
          />
          <TableHeaderRow showSortingControls />
          <Toolbar />
          <SearchPanel />
          <PagingPanel />
        </Grid>
      </div>
    );
  }
}

export default MyTable;
