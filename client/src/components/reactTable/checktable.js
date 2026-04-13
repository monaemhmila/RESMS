import { useMemo, useState, useEffect } from 'react';
import { Box, Flex, Table, Tbody, Td, Text, Th, Thead, Tr, Button, HStack, Tag, TagLabel, Menu, MenuButton, MenuDivider, MenuItem, MenuList, Grid, GridItem, Checkbox, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, TagCloseButton } from '@chakra-ui/react';
import { useColorModeValue } from '@chakra-ui/system';
import { BsColumnsGap } from "react-icons/bs";
import { FaSort, FaSortDown, FaSortUp } from 'react-icons/fa';
import { SearchIcon, DeleteIcon, AddIcon } from "@chakra-ui/icons";
import { useGlobalFilter, usePagination, useSortBy, useTable } from 'react-table';
import Card from 'components/card/Card';
import CountUpComponent from 'components/countUpComponent/countUpComponent';
import Pagination from 'components/pagination/Pagination';
import Spinner from 'components/spinner/Spinner';
import CustomSearchInput from "../search/search";
import AdvanceSearchUsingCustomFields from "../search/advanceSearch";
import DataNotFound from "../notFoundData";
import moment from 'moment';
import { useSelector, useDispatch } from 'react-redux';
import { getSearchData, setGetTagValues, setSearchValue } from '../../redux/slices/advanceSearchSlice'
import { commonUtils } from 'utils/utils';

const CommonCheckTable = (props) => {
    const {
        isLoding,
        title,
        columnData,
        size,
        // dataColumn,
        setSearchedDataOut,
        state,
        allData,
        ManageGrid,
        deleteMany,
        tableCustomFields,
        access,
        // selectedColumns,
        // setSelectedColumns,
        onOpen,
        setDelete,
        selectedValues,
        setSelectedValues,
        setIsImport,
        checkBox,
        AdvanceSearch,
        searchDisplay,
        setSearchDisplay,
        BackButton,
        searchboxOutside,
        setGetTagValuesOutside,
        setSearchboxOutside,
        selectType,
        customSearch,
    } = props;
    const { dataLength } = props;
    const { handleSearchType } = props;

    const textColor = useColorModeValue("secondaryGray.900", "white");
    const borderColor = useColorModeValue("gray.200", "whiteAlpha.100");

    const [displaySearchData, setDisplaySearchData] = useState(false);
    const [searchedData, setSearchedData] = useState([]);

    const [columns, setColumns] = useState(columnData || []);
    const [tempSelectedColumns, setTempSelectedColumns] = useState(columns || []);

    const searchedDataOut = useSelector((state) => state?.advanceSearchData?.searchResult)
    const searchValue = useSelector((state) => state?.advanceSearchData?.searchValue)
    const getTagValues = useSelector((state) => state?.advanceSearchData?.getTagValues)
    const data = useMemo(() => (AdvanceSearch ? searchDisplay : displaySearchData) ? (AdvanceSearch ? searchedDataOut : searchedData) : allData, [searchDisplay, displaySearchData, AdvanceSearch, searchedDataOut, searchedData, allData]);

    const [manageColumnsModel, setManageColumnsModel] = useState(false);
    const [csvColumns, setCsvColumns] = useState([]);
    const [searchbox, setSearchbox] = useState('');
    const [advaceSearch, setAdvaceSearch] = useState(false);
    // const [column, setColumn] = useState('');
    const [gopageValue, setGopageValue] = useState();

    const dispatch = useDispatch();

    const tableInstance = useTable(
        {
            columns,
            data,
            initialState: { pageIndex: 0 }
        },
        useGlobalFilter,
        useSortBy,
        usePagination
    );

    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        prepareRow,
        page,
        canPreviousPage,
        canNextPage,
        pageOptions,
        pageCount,
        gotoPage,
        nextPage,
        previousPage,
        setPageSize,
        state: { pageIndex, pageSize }
    } = tableInstance;

    if (pageOptions && pageOptions?.length > 0 && pageOptions?.length < gopageValue) {
        setGopageValue(pageOptions.length)
    }

    const handleSearch = (results) => {
        AdvanceSearch && dispatch(getSearchData({ searchData: (results || []), type: handleSearchType }))
        AdvanceSearch ? setSearchedDataOut(results || []) : setSearchedData(results || []);
    };

    const handleAdvanceSearch = (values) => {
        dispatch(setSearchValue(values))
        const searchResult = AdvanceSearch ? dispatch(getSearchData({ values: values, allData: allData, type: title })) : allData?.filter(item => {
            return tableCustomFields.every(field => {
                const fieldValue = values[field.name];
                const itemValue = item[field.name];

                if (field.type === 'select') {
                    return !fieldValue || itemValue === fieldValue;
                }
                else if (field.type === 'number') {
                    return (
                        [null, undefined, ''].includes(fieldValue) ||
                        (itemValue !== undefined &&
                            itemValue.toString().includes(fieldValue.toString()))
                    );
                }
                else if (field.type === 'date') {
                    const fromDate = values[`from${field.name}`];
                    const toDate = values[`to${field.name}`];

                    if (!fromDate && !toDate) {
                        return true; // No date range specified
                    }

                    const timeItemDate = new Date(itemValue);
                    const timeMomentDate = moment(timeItemDate).format('YYYY-MM-DD');

                    return (
                        (!fromDate || (timeMomentDate >= fromDate)) &&
                        (!toDate || (timeMomentDate <= toDate))
                    );
                }
                else {
                    // Default case for text, email
                    return !fieldValue || itemValue?.toLowerCase()?.includes(fieldValue?.toLowerCase());
                }
            });
        });

        const getValue = tableCustomFields.reduce((result, field) => {
            if (field.type === 'date') {
                const fromDate = values[`from${field.name}`];
                const toDate = values[`to${field.name}`];

                if (fromDate || toDate) {
                    result.push({
                        name: [`from${field.name}`, `to${field.name}`],
                        value: `From: ${fromDate} To: ${toDate}`
                    })
                }
            } else if (values[field.name]) {
                result.push({
                    name: [field.name],
                    value: values[field.name]
                })
            }

            return result;
        }, []);
        dispatch(setGetTagValues(getValue))
        setSearchedData(searchResult);
        setDisplaySearchData(true);
        setAdvaceSearch(false);
        if (setSearchbox) {
            setSearchbox('');
        }
    }


    const handleClear = () => {
        setSearchDisplay && setSearchDisplay(false)
        setDisplaySearchData && setDisplaySearchData(false)
        if (searchboxOutside) {
            setSearchboxOutside('')
        } else {
            setSearchbox('');
        }
        dispatch(setGetTagValues([]))
        if (props?.getTagValuesOutSide) {
            setGetTagValuesOutside([]);
        }
        setGopageValue(1);
    };

    const handleClick = () => {
        onOpen();
    };

    const findStatus = () => {
        const searchResult = allData?.filter(
            (item) =>
                (!state || (item?.status && item?.status?.toLowerCase().includes(state?.toLowerCase())))
        )
        let getValue = [state || undefined].filter(value => value);

        dispatch(setGetTagValues(getValue))
        AdvanceSearch ? setSearchedDataOut && setSearchedDataOut(searchResult) : setSearchedData && setSearchedData(searchResult);
        AdvanceSearch ? setSearchDisplay && setSearchDisplay(true) : setDisplaySearchData && setDisplaySearchData(searchResult);
        setDisplaySearchData(true)
        setAdvaceSearch(false)
    }

    useEffect(() => {
        state && findStatus()
    }, [state, allData]);

    const toggleColumnVisibility = (columnKey) => {
        let updatedColumns;

        if (tempSelectedColumns?.some((column) => column?.accessor === columnKey)) {
            updatedColumns = tempSelectedColumns?.filter((column) => column?.accessor !== columnKey);
        } else {
            const columnToAdd = columnData?.find((column) => column?.accessor === columnKey);
            updatedColumns = [...tempSelectedColumns, columnToAdd];
        }

        const orderedColumns = columnData?.filter(column => updatedColumns.some(updatedColumn => updatedColumn?.accessor === column?.accessor));
        setTempSelectedColumns(orderedColumns);

    };

    const handleCheckboxChange = (event, value) => {
        if (selectType === "single") {
            if (event.target.checked) {
                setSelectedValues && setSelectedValues(value);
            } else {
                setSelectedValues();
            }
        } else if (event.target.checked) {
            setSelectedValues && setSelectedValues((prevSelectedValues) => [...prevSelectedValues, value]);
        } else {
            setSelectedValues && setSelectedValues((prevSelectedValues) =>
                prevSelectedValues.filter((selectedValue) => selectedValue !== value)
            );
        }

    };

    const handleColumnClose = () => {
        setManageColumnsModel(!manageColumnsModel)
    };


    const handleExportLeads = (extension) => {
        selectedValues && selectedValues?.length > 0
            ? downloadCsvOrExcel(extension, selectedValues)
            : downloadCsvOrExcel(extension);
    };

    const downloadCsvOrExcel = async (extension, selectedIds) => {
        try {
            if (selectedIds && selectedIds?.length > 0) {
                const selectedRecordsWithSpecificFileds = allData?.filter((rec) => selectedIds.includes(rec._id))?.map((rec) => {
                    const selectedFieldsData = {};
                    csvColumns?.forEach((property) => {
                        selectedFieldsData[property.accessor] = rec[property.accessor];
                    });
                    return selectedFieldsData;
                });
                commonUtils.convertJsonToCsvOrExcel({
                    jsonArray: selectedRecordsWithSpecificFileds,
                    csvColumns: csvColumns,
                    fileName: title || 'data',
                    extension: extension
                });
            } else {
                const AllRecordsWithSpecificFileds = allData?.map((rec) => {
                    const selectedFieldsData = {};
                    csvColumns?.forEach((property) => {
                        selectedFieldsData[property?.accessor] = rec[property?.accessor];
                    });
                    return selectedFieldsData;
                });
                commonUtils.convertJsonToCsvOrExcel({
                    jsonArray: AllRecordsWithSpecificFileds,
                    csvColumns: csvColumns,
                    fileName: title || 'data',
                    extension: extension
                });
            }
            setSelectedValues([])
        } catch (e) {
            console.error(e);
        }
    };

    const handleRemoveFromTag = (name) => {
        const filter = (getTagValues || []).filter((item) => {
            if (Array.isArray(name?.name)) {
                return name.name?.toString() !== item.name?.toString();
            }
        });

        let updatedSearchValue = { ...searchValue };
        for (let key in updatedSearchValue) {
            if (updatedSearchValue.hasOwnProperty(key)) {
                if (name.name.includes(key)) {
                    delete updatedSearchValue[key];
                }
                if (updatedSearchValue[key] === "") {
                    delete updatedSearchValue[key];
                }
            }
        }

        handleAdvanceSearch(updatedSearchValue)

        dispatch(setGetTagValues(filter))
        if (filter?.length === 0) {
            handleClear();
        }
    }

    useEffect(() => {
        AdvanceSearch ? setSearchedDataOut && setSearchedDataOut(data) : setSearchedData && setSearchedData(data);
    }, []);

    useEffect(() => {
        setColumns(columnData);
    }, [columnData]);

    useEffect(() => {
        if (columns) {
            let tempCsvColumns = columns?.filter((col) => col?.Header !== '#' && col?.Header !== 'Action')?.map((field) => ({ Header: field?.Header, accessor: field?.accessor }));
            setCsvColumns([...tempCsvColumns])
        }
    }, [columns]);

    return (
        <>
            <Card
                direction="column"
                w="100%"
                overflowX={{ sm: "scroll", lg: "hidden" }}
                borderRadius="16px"
                boxShadow="0 4px 24px -8px rgba(66,42,251,0.10)"
                border="1px solid"
                borderColor="rgba(66,42,251,0.08)"
                p={{ base: 3, md: 5 }}
            >
                <Grid templateColumns="repeat(12, 1fr)" gap={2} mb={3}>
                    <GridItem colSpan={{ base: 12, md: 8 }} display={"flex"} alignItems={"center"}>
                        <Flex alignItems={"center"} flexWrap={"wrap"} gap={2}>
                            {
                                title &&
                                <Flex alignItems="baseline" gap={2}>
                                    <Text
                                        color={'secondaryGray.900'}
                                        fontSize="20px"
                                        fontWeight="800"
                                        lineHeight="100%"
                                        textTransform={'capitalize'}
                                        letterSpacing="-0.3px"
                                    >
                                        {title}
                                    </Text>
                                    <Box
                                        as="span"
                                        bg="linear-gradient(135deg, #422AFB 0%, #7551FF 100%)"
                                        color="white"
                                        fontSize="11px"
                                        fontWeight="700"
                                        px={2}
                                        py={0.5}
                                        borderRadius="full"
                                        minW="28px"
                                        textAlign="center"
                                        boxShadow="0 2px 8px -2px rgba(66,42,251,0.4)"
                                    >
                                        <CountUpComponent key={data?.length} targetNumber={dataLength || data?.length} />
                                    </Box>
                                </Flex>
                            }
                            {customSearch !== false && <CustomSearchInput setSearchbox={setSearchboxOutside ? setSearchboxOutside : setSearchbox} setDisplaySearchData={setSearchboxOutside ? props.setSearchDisplay : setDisplaySearchData} searchbox={searchboxOutside ? searchboxOutside : searchbox} allData={allData} dataColumn={columns} onSearch={handleSearch} setGetTagValues={props.setGetTagValuesOutside ? props.setGetTagValuesOutside : setGetTagValues} setGopageValue={setGopageValue} />}
                            {
                                AdvanceSearch ? AdvanceSearch : AdvanceSearch !== false &&
                                    <Button variant="outline" colorScheme='brand' leftIcon={<SearchIcon />} mt={{ sm: "5px", md: "0" }} size="sm" onClick={() => setAdvaceSearch(true)} borderRadius="8px">Advance Search</Button>
                            }
                            {(searchDisplay || displaySearchData) ? <Button variant="outline" colorScheme='red' size="sm" ms={2} onClick={() => handleClear()} borderRadius="8px">Clear</Button> : ""}
                            {(selectedValues?.length > 0 && access?.delete && !deleteMany) && <DeleteIcon cursor={"pointer"} onClick={() => setDelete(true)} color={'red'} ms={2} />}
                        </Flex>
                    </GridItem>
                    {/* Advance filter */}
                    <AdvanceSearchUsingCustomFields
                        setAdvaceSearch={setAdvaceSearch}
                        setGetTagValues={setGetTagValues}
                        isLoding={isLoding}
                        allData={allData}
                        setDisplaySearchData={setDisplaySearchData}
                        setSearchedData={setSearchedData}
                        advaceSearch={advaceSearch}
                        tableCustomFields={tableCustomFields}
                        setSearchbox={setSearchbox}
                        handleAdvanceSearch={handleAdvanceSearch}
                    />
                    <GridItem colSpan={{ base: 12, md: 4 }} display={"flex"} justifyContent={"end"} alignItems={"center"} textAlign={"right"} gap={2}>
                        {ManageGrid !== false &&
                            <Menu isLazy>
                                <MenuButton
                                    as={Button}
                                    size="sm"
                                    variant="ghost"
                                    colorScheme="gray"
                                    borderRadius="8px"
                                    _hover={{ bg: 'rgba(66,42,251,0.06)' }}
                                    leftIcon={<BsColumnsGap />}
                                >
                                    Columns
                                </MenuButton>
                                <MenuList minW={'fit-content'} zIndex={2} borderRadius="10px" boxShadow="0 8px 32px -8px rgba(0,0,0,0.18)" border="1px solid" borderColor="gray.100">
                                    <MenuItem onClick={() => setManageColumnsModel(true)} width={"165px"} fontSize="sm"> Manage Columns
                                    </MenuItem>
                                    {typeof setIsImport === "function" && <MenuItem width={"165px"} onClick={() => setIsImport(true)} fontSize="sm"> Import {title}
                                    </MenuItem>}
                                    {
                                        allData && allData?.length > 0 &&
                                        <>
                                            <MenuDivider />
                                            <MenuItem width={"165px"} onClick={() => handleExportLeads('csv')} fontSize="sm">{selectedValues && selectedValues?.length > 0 ? 'Export Selected as CSV' : 'Export as CSV'}</MenuItem>
                                            <MenuItem width={"165px"} onClick={() => handleExportLeads('xlsx')} fontSize="sm">{selectedValues && selectedValues?.length > 0 ? 'Export Selected as Excel' : 'Export as Excel'}</MenuItem>
                                        </>
                                    }
                                </MenuList>
                            </Menu>}
                        {(access?.create || access === true) && (
                            <Button
                                onClick={() => handleClick()}
                                size="sm"
                                variant="brand"
                                leftIcon={<AddIcon />}
                                borderRadius="8px"
                                bgGradient="linear(to-r, #422AFB, #7551FF)"
                                _hover={{ bgGradient: 'linear(to-r, #3311DB, #5a35ff)', transform: 'translateY(-1px)', boxShadow: '0 4px 16px -4px rgba(66,42,251,0.5)' }}
                                transition="all 0.2s ease"
                            >Add New</Button>
                        )}
                        {BackButton && BackButton}
                    </GridItem>
                    {(getTagValues || []).length > 0 && (
                        <GridItem colSpan={12}>
                            <HStack spacing={2} flexWrap="wrap">
                                {(getTagValues || []).map((item) => (
                                    <Tag
                                        size={"sm"}
                                        px={3}
                                        py={1.5}
                                        key={item.value}
                                        borderRadius='full'
                                        bg="rgba(66,42,251,0.08)"
                                        color="brand.600"
                                        border="1px solid"
                                        borderColor="rgba(66,42,251,0.2)"
                                        fontWeight="600"
                                        fontSize="11px"
                                    >
                                        <TagLabel>{item.value}</TagLabel>
                                        <TagCloseButton onClick={() => handleRemoveFromTag(item)} />
                                    </Tag>
                                ))}
                            </HStack>
                        </GridItem>
                    )}
                </Grid>
                <Box overflowY={"auto"} className={size ? `small-table-fix-container` : `table-fix-container`} borderRadius="10px" border="1px solid" borderColor="gray.100">
                    <Table {...getTableProps()} variant="simple" color="gray.500" mb="0">
                        <Thead>
                            {headerGroups?.map((headerGroup, index) => (
                                <Tr {...headerGroup.getHeaderGroupProps()} key={index}>
                                    {headerGroup.headers?.map((column, index) => (
                                        <Th
                                            {...column.getHeaderProps(column.isSortable !== false && column.getSortByToggleProps())}
                                            key={index}
                                            borderColor="transparent"
                                            cursor={column.isSortable !== false ? 'pointer' : 'default'}
                                            _hover={column.isSortable !== false ? { color: 'brand.500' } : {}}
                                            transition="color 0.15s ease"
                                            whiteSpace="nowrap"
                                        >
                                            <Flex
                                                align="center"
                                                justifyContent={column.center ? "center" : "start"}
                                                gap={1.5}
                                            >
                                                <Box as="span" fontWeight="700" fontSize="11px" letterSpacing="0.7px" textTransform="uppercase" color={column.isSorted ? 'brand.500' : 'gray.500'}>
                                                    {column.render("Header")}
                                                </Box>
                                                {column.isSortable !== false && (
                                                    <Box as="span" color={column.isSorted ? 'brand.500' : 'gray.300'} transition="color 0.15s ease">
                                                        {column.isSorted
                                                            ? (column.isSortedDesc
                                                                ? <FaSortDown style={{ marginBottom: '-3px' }} />
                                                                : <FaSortUp style={{ marginTop: '-3px' }} />)
                                                            : <FaSort />}
                                                    </Box>
                                                )}
                                            </Flex>
                                        </Th>
                                    ))}
                                </Tr>
                            ))}
                        </Thead>
                        <Tbody {...getTableBodyProps()}>
                            {isLoding ? (
                                Array.from({ length: 6 }).map((_, i) => (
                                    <Tr key={i}>
                                        {Array.from({ length: columns?.length || 4 }).map((_, j) => (
                                            <Td key={j} borderColor="transparent" py={4}>
                                                <Box
                                                    h="14px"
                                                    borderRadius="6px"
                                                    bg="linear-gradient(90deg, #f0f2ff 25%, #e6e9ff 50%, #f0f2ff 75%)"
                                                    backgroundSize="200% 100%"
                                                    sx={{
                                                        animation: 'shimmer 1.4s infinite',
                                                        '@keyframes shimmer': {
                                                            '0%': { backgroundPosition: '200% 0' },
                                                            '100%': { backgroundPosition: '-200% 0' },
                                                        }
                                                    }}
                                                    opacity={1 - i * 0.12}
                                                />
                                            </Td>
                                        ))}
                                    </Tr>
                                ))
                            ) : (data && data?.length === 0) || data === undefined ? (
                                <Tr>
                                    <Td colSpan={columns.length} borderColor="transparent" py={12}>
                                        <Flex direction="column" alignItems="center" gap={3}>
                                            <Box
                                                w="64px" h="64px"
                                                borderRadius="full"
                                                bg="rgba(66,42,251,0.06)"
                                                display="flex" alignItems="center" justifyContent="center"
                                                fontSize="28px"
                                            >
                                                🔍
                                            </Box>
                                            <Text fontSize="sm" fontWeight="600" color="gray.500">No records found</Text>
                                            <Text fontSize="xs" color="gray.400">Try adjusting your search or filters</Text>
                                        </Flex>
                                    </Td>
                                </Tr>
                            ) : page?.map((row, i) => {
                                    prepareRow(row);
                                    return (
                                        <Tr {...row?.getRowProps()}>
                                            {row?.cells?.map((cell, index) => {
                                                let data = "";
                                                columnData?.forEach((item) => {
                                                    if (cell?.column.Header === item.Header) {
                                                        if (item.cell && typeof item.cell === 'function') {
                                                            data = (
                                                                <Flex align="center" justifyContent={item?.Header === 'Action' && 'center'}>
                                                                    <Box color={textColor} fontSize="sm" fontWeight="700" >
                                                                        {item.cell(cell) === ' ' ? '-' : item.cell(cell)}
                                                                    </Box>
                                                                </Flex>
                                                            );
                                                        }
                                                        else {
                                                            data = (
                                                                <Flex align="center" >
                                                                    {item.Header ===
                                                                        "#" &&
                                                                        (checkBox || checkBox === undefined) && (
                                                                            <Checkbox
                                                                                colorScheme="brandScheme"
                                                                                value={selectedValues}
                                                                                isChecked={selectedValues?.includes(cell?.value)}
                                                                                onChange={(event) => handleCheckboxChange(event, cell?.value)}
                                                                                me="10px"
                                                                            />
                                                                        )}

                                                                    <Text color={textColor} fontSize="sm" fontWeight="700">
                                                                        {item.Header === "#" ? cell?.row?.index + 1 : cell?.value ? cell?.value : '-'}
                                                                    </Text>
                                                                </Flex>
                                                            );
                                                        }
                                                    }
                                                });
                                                return (
                                                    <Td
                                                        {...cell?.getCellProps()}
                                                        key={index}
                                                        fontSize={{ sm: "14px" }}
                                                        minW={{ sm: "150px", md: "200px", lg: "auto" }}
                                                        borderColor="transparent"
                                                    >
                                                        {data}
                                                    </Td>
                                                );
                                            })}
                                        </Tr>
                                    );
                                })}
                        </Tbody>
                    </Table>
                </Box>
                {data?.length > 5 && <Pagination gotoPage={gotoPage} gopageValue={gopageValue} setGopageValue={setGopageValue} pageCount={pageCount} canPreviousPage={canPreviousPage} previousPage={previousPage} canNextPage={canNextPage} pageOptions={pageOptions} setPageSize={setPageSize} nextPage={nextPage}
                    pageSize={pageSize} pageIndex={pageIndex} dataLength={15} />}

                {/* Manage Columns */}
                <Modal onClose={() => { setManageColumnsModel(false); }} isOpen={manageColumnsModel} isCentered>
                    <ModalOverlay />
                    <ModalContent>
                        <ModalHeader>Manage Columns</ModalHeader>
                        <ModalCloseButton onClick={() => { setManageColumnsModel(false); }} />
                        <ModalBody>
                            <div>
                                {columnData?.map((column) => (
                                    <Box display={"flex"} alignItems={"center"} key={column?.accessor} py={2}>
                                        <Checkbox
                                            defaultChecked={columns?.some((item) => item?.accessor === column?.accessor)}
                                            onChange={() => toggleColumnVisibility(column?.accessor)}
                                            pe={2}
                                        />
                                        {column?.Header}
                                    </Box>
                                ))}
                            </div>
                        </ModalBody>
                        <ModalFooter>
                            <Button
                                colorScheme='brand'
                                mr={2}
                                onClick={() => {
                                    setColumns([...tempSelectedColumns]);
                                    setManageColumnsModel(false);
                                }}
                                disabled={isLoding ? true : false}
                                size='sm'
                            >
                                {isLoding ? <Spinner /> : 'Save'}
                            </Button>
                            <Button
                                variant='outline'
                                colorScheme="red"
                                size='sm'
                                onClick={() => handleColumnClose()}
                            >
                                Close
                            </Button>
                        </ModalFooter>
                    </ModalContent>
                </Modal>

            </Card>
        </>
    );
}

export default CommonCheckTable