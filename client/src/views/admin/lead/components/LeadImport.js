import React, { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom';
import Papa from 'papaparse';
import {
    Flex,
    useColorModeValue,
    Select,
    Button,
    Text,
    Grid,
    GridItem
} from "@chakra-ui/react";
import { useFormik } from "formik";
import { postApi } from 'services/api';
import { toast } from 'react-toastify';
import moment from 'moment';
import ExcelJS from 'exceljs';
import Card from 'components/card/Card';
function LeadImport() {
    const location = useLocation();
    const { fileData, customFields } = location.state || {};
    const [importedFileFields, setImportedFileFields] = useState([]);
    const [importedFileData, setImportedFileData] = useState([]);
    const [isLoding, setIsLoding] = useState(false);
    const navigate = useNavigate();
    const [filterLead, setFilterLead] = useState([]);

    const columns = [
        { Header: 'Fields In CRM', accessor: 'crmFields' },
        { Header: 'Fields In File', accessor: 'fileFields' },
    ];

    const initialFieldValues = Object.fromEntries(
        (customFields || []).map(field => [field?.name, ''])
    );
    const initialValues = { ...initialFieldValues };

    const fieldsInCrm = [
        ...customFields?.map((field) => ({
            Header: field?.label,
            accessor: field?.name,
            type: field?.type,
            formikType: field?.validations?.find(obj => obj.hasOwnProperty('formikType'))
        }))
    ];

    const formik = useFormik({
        initialValues: initialValues,
        onSubmit: (values, { resetForm }) => {
            console.log('Form submitted with values:', values);
            const leadsData = importedFileData?.map((item, ind) => {
                const lead = {
                    createdDate: new Date(),
                    deleted: item[values.deleted || "deleted"] || false,
                    createBy: JSON.parse(localStorage.getItem('user'))._id,
                };

                fieldsInCrm?.forEach(field => {
                    const selectedField = values[field?.accessor];
                    const fieldValue = item[selectedField] || '';

                    console.log(`Processing field: ${field.accessor}, type: ${field.type}, value: ${fieldValue}`);

                    if (field?.type?.toLowerCase() === "date") {
                        lead[field?.accessor] = moment(fieldValue).isValid() ? fieldValue : '';
                    } else if (field?.type?.toLowerCase() === "number" && ['positive', 'negative'].includes(field?.formikType?.toLowerCase())) {
                        lead[field?.accessor] = parseFloat(fieldValue) || '';
                    } else if (field?.type?.toLowerCase() === "number") {
                        lead[field?.accessor] = parseInt(fieldValue, 10) || '';
                    } else {
                        lead[field?.accessor] = fieldValue;
                    }
                });

                return lead;
            });

            AddData(leadsData);
        }
    });

    const { errors, touched, values, handleBlur, handleSubmit, setFieldValue, resetForm } = formik;

    const AddData = async (leads) => {
        try {
            console.log('Starting AddData function with leads:', leads);
            setIsLoding(true);
            let response = await postApi('api/lead/addMany', leads);
            console.log('Response from API:', response);

            if (response.status === 200) {
                toast.success(`Leads imported successfully`);
                formik.resetForm();
                navigate('/lead');
            }
        } catch (e) {
            console.error('Error in AddData:', e);
            toast.error(`Leads import failed`);
            formik.resetForm();
            navigate('/lead');
        } finally {
            setIsLoding(false);
        }
    };

    const parseFileData = async (file) => {
        console.log('Parsing file:', file.name);
        const reader = new FileReader();
        const extension = file.name.split('.').pop().toLowerCase();

        reader.onload = async ({ target }) => {
            console.log('File loaded with extension:', extension);

            if (extension === 'csv') {
                const csv = Papa.parse(target.result, { header: true });
                const parsedData = csv?.data;

                console.log('Parsed CSV data:', parsedData);

                if (parsedData && parsedData.length > 0) {
                    setImportedFileData(parsedData);
                    const fileHeadingFields = Object.keys(parsedData[0]);
                    setImportedFileFields(fileHeadingFields);
                } else {
                    toast.error("Empty or invalid CSV file");
                    navigate("/lead");
                }

            } else if (extension === 'xlsx') {
                const data = new Uint8Array(target.result);
                const workbook = new ExcelJS.Workbook();
                await workbook.xlsx.load(data);

                const worksheet = workbook.getWorksheet(1);
                const jsonData = [];

                worksheet.eachRow({ includeEmpty: true }, (row, rowNumber) => {
                    const rowData = {};
                    row.eachCell({ includeEmpty: true }, (cell, colNumber) => {
                        rowData[worksheet.getCell(1, colNumber).value] = cell.value;
                    });
                    jsonData.push(rowData);
                });

                jsonData?.splice(0, 1);
                setImportedFileData(jsonData);

                console.log('Parsed XLSX data:', jsonData);

                if (jsonData && jsonData.length > 0) {
                    const fileHeadingFields = Object.keys(jsonData[0]);
                    setImportedFileFields(fileHeadingFields);
                } else {
                    toast.error("Empty or invalid XLSX file");
                    navigate("/lead");
                }
            }
        };

        if (extension === 'csv') {
            reader.readAsText(file);
        } else if (extension === 'xlsx') {
            const blob = new Blob([file]);
            reader.readAsArrayBuffer(blob);
        }
    };

    useEffect(() => {
        if (fileData && fileData.length > 0) {
            console.log('File data available. Parsing first file.');
            const firstFile = fileData[0];
            parseFileData(firstFile);
        }
    }, [fileData]);

    useEffect(() => {
        console.log('Setting initial values for imported fields:', importedFileFields);
        const filterLeadData = importedFileFields?.filter(field => {
            const result = fieldsInCrm?.find(data => field === data?.accessor || field === data?.Header);
            if (result) {
                setFieldValue(result?.accessor, field);
                return true;
            }
            return false;
        });
        setFilterLead(filterLeadData);
        console.log('Filtered leads:', filterLeadData);
    }, [importedFileFields]);
    
    return (
        <>
            <Card overflowY={"auto"} className="importTable">
                <Text color={"secondaryGray.900"}
                    fontSize="22px"
                    fontWeight="700"
                    mb='20px'
                >Import Leads</Text>
                <Grid templateColumns="repeat(12, 1fr)" mb={3} pb={2} gap={1} borderBottom={'1px solid #e2e8f0'}>
                    {
                        columns.map((column, index) => (
                            <GridItem key={index} colSpan={{ base: 6 }} fontWeight={'600'} fontSize={{ sm: "14px", lg: "14px" }} color="secondaryGray.900" style={{ textTransform: "uppercase" }}>
                                {column.Header}
                            </GridItem>
                        ))
                    }
                </Grid>
                <Grid templateColumns="repeat(12, 1fr)" mb={3} gap={1} overflowY={'auto'}>
                    {
                        fieldsInCrm?.map((item, index) => (
                            <>
                                <GridItem colSpan={{ base: 6 }} key={item.id} mt='10px'>
                                    {item.Header}
                                </GridItem>
                                <GridItem colSpan={{ base: 4 }}>
                                <Select
    variant="flushed"
    fontWeight="500"
    isSearchable
    value={values[item.accessor]}
    name={item.accessor}
    onChange={(e) => setFieldValue(item.accessor, e.target.value)} // Replaces handleChange with formik's setFieldValue
>

                                        <option value=''> {filterLead ? filterLead.find((data) => (item.Header === data || item.accessor === data) && data) ? filterLead.find((data) => (item.Header === data || item.accessor === data) && data) : 'Select Field In File' : 'Select Field In File'}</option>
                                        {
                                            importedFileFields?.map(field => (
                                                <option value={field} key={field}>{field}</option>
                                            ))
                                        }
                                    </Select>
                                </GridItem>
                            </>
                        ))
                    }
                </Grid>
                <Flex Flex justifyContent={'end'} mt='5' >
                    <Button size="sm" onClick={() => handleSubmit()} variant="brand">Save</Button>
                </Flex>
            </Card>
        </>
    )
}

export default LeadImport