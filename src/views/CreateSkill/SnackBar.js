import React from "react";
import { SnackbarProvider, useSnackbar } from "notistack";
const RunSnackBar = props => {
  const { enqueueSnackbar } = useSnackbar();
  enqueueSnackbar(props.message, props.variant);
  console.log(props.message + "Hello");
  return null;
};

export default RunSnackBar;
