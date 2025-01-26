import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Radio,
} from "@material-ui/core";
import { Option, Attribute } from "../../../../../../interface/interface";

interface TableOptionProps {
  option: Option;
  selectedColumn: string;
  onSelec;
}
