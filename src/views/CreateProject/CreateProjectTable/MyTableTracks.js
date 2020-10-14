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
        { columnName: "trackName", width: 350 },
        {
          columnName: "roleName",
          width: 300
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
              { columnName: "trackName", direction: "asc" },
              // { columnName: "skillname", direction: "asc" },
              { columnName: "roleName", direction: "asc" }
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
          <TableHeaderRow />
          <Toolbar />
          <SearchPanel />
          <PagingPanel />
        </Grid>
      </div>
    );
  }
}

export default MyTable;
