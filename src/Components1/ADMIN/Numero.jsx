import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Paper from '@mui/material/Paper';
import Accordion from 'react-bootstrap/Accordion';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TablePagination from '@mui/material/TablePagination';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';

import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { CDBBox, CDBContainer } from 'cdbreact';
import Button from '@mui/material/Button';
import NumeroForm from './NumeroForm'; // Assume you have this component
import EditNumero from './EditNumero';
import AFNumero from './AFNumero';  // Assume you have this component
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import ProgressBar from './ProgressLabel';
import { Box, Tabs, Tab } from '@mui/material';
import SimCardIcon from '@mui/icons-material/SimCard';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';
import Numeros from "./Numeros";
import Forfait from "./Forfaits";
function CustomTabPanel({ value, index, children }) {
    return (
        <div role="tabpanel" hidden={value !== index}>
            {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
        </div>
    );
}

export default function Numero() {
    const [value, setValue] = useState(0);
    const role = localStorage.getItem('role');
    const handleChange = (event, newValue) => {
        setValue(newValue);
    };
return (
        <Box sx={{ marginTop: "65px" }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs
                value={value}
                onChange={handleChange}
                textColor="secondary"
                indicatorColor="secondary"
                aria-label="secondary tabs example"
            >
                <Tab value={0} label="Les Cartes SIMs" />
                <Tab value={1} label="Les Affectations" />
               
                {role === 'ADMIN' &&  <Tab value={2} label="Les Forfaits" />}
            </Tabs>
        </Box>
        <CustomTabPanel value={value} index={0}>
        {role === 'ADMIN' && (  <ProgressBar sx={{color:"green"}} />)}
            <Numeros />
        </CustomTabPanel>
        <CustomTabPanel value={value} index={1}>
            <AFNumero />
        </CustomTabPanel>
        {role === 'ADMIN' && (
        <CustomTabPanel value={value} index={2}>
          
            <Forfait  />
        </CustomTabPanel>     )}
    </Box>
    );
}
