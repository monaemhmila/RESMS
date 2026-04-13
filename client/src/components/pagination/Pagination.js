import { ArrowLeftIcon, ArrowRightIcon, ChevronLeftIcon, ChevronRightIcon } from '@chakra-ui/icons';
import { Box, Flex, IconButton, Select, Text, Tooltip } from '@chakra-ui/react';
import React, { useEffect } from 'react';

const Pagination = (props) => {
    const { gotoPage, gopageValue, setGopageValue, pageCount, canPreviousPage, previousPage, canNextPage, pageOptions, setPageSize, nextPage, pageSize, pageIndex } = props;

    useEffect(() => {
        setGopageValue(1);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const totalPages = pageOptions?.length || 1;
    const current = pageIndex + 1;

    return (
        <Flex
            justifyContent="space-between"
            alignItems="center"
            mt={4}
            px={1}
            flexWrap="wrap"
            gap={3}
        >
            {/* Left: rows per page */}
            <Flex alignItems="center" gap={2}>
                <Text fontSize="12px" color="gray.500" fontWeight="500" whiteSpace="nowrap">Rows per page</Text>
                <Select
                    size="sm"
                    w="80px"
                    value={pageSize}
                    borderRadius="8px"
                    fontSize="12px"
                    fontWeight="600"
                    borderColor="gray.200"
                    _focus={{ borderColor: 'brand.400', boxShadow: '0 0 0 1px rgba(66,42,251,0.3)' }}
                    onChange={(e) => setPageSize(Number(e.target.value))}
                >
                    {[5, 10, 20, 30, 50].map((size) => (
                        <option key={size} value={size}>{size}</option>
                    ))}
                </Select>
            </Flex>

            {/* Center: page info */}
            {totalPages > 1 && (
                <Text fontSize="12px" color="gray.500" fontWeight="500">
                    Page{' '}
                    <Box as="span" fontWeight="700" color="secondaryGray.900">{current}</Box>
                    {' '}of{' '}
                    <Box as="span" fontWeight="700" color="secondaryGray.900">{totalPages}</Box>
                </Text>
            )}

            {/* Right: nav buttons */}
            {totalPages > 1 && (
                <Flex alignItems="center" gap={1}>
                    <Tooltip label="First page" hasArrow>
                        <IconButton
                            size="sm"
                            variant="ghost"
                            borderRadius="8px"
                            onClick={() => { gotoPage(0); setGopageValue(1); }}
                            isDisabled={!canPreviousPage}
                            icon={<ArrowLeftIcon h={2.5} w={2.5} />}
                            _hover={{ bg: 'rgba(66,42,251,0.08)', color: 'brand.500' }}
                            aria-label="First page"
                        />
                    </Tooltip>
                    <Tooltip label="Previous page" hasArrow>
                        <IconButton
                            size="sm"
                            variant="ghost"
                            borderRadius="8px"
                            onClick={() => { previousPage(); setGopageValue((p) => p - 1); }}
                            isDisabled={!canPreviousPage}
                            icon={<ChevronLeftIcon h={5} w={5} />}
                            _hover={{ bg: 'rgba(66,42,251,0.08)', color: 'brand.500' }}
                            aria-label="Previous page"
                        />
                    </Tooltip>

                    {/* Numbered page pills */}
                    {Array.from({ length: Math.min(5, totalPages) }).map((_, i) => {
                        let page;
                        if (totalPages <= 5) {
                            page = i + 1;
                        } else if (current <= 3) {
                            page = i + 1;
                        } else if (current >= totalPages - 2) {
                            page = totalPages - 4 + i;
                        } else {
                            page = current - 2 + i;
                        }
                        const isActive = page === current;
                        return (
                            <Box
                                key={page}
                                as="button"
                                w="32px"
                                h="32px"
                                borderRadius="8px"
                                fontSize="12px"
                                fontWeight={isActive ? '700' : '500'}
                                color={isActive ? 'white' : 'gray.600'}
                                bg={isActive ? 'linear-gradient(135deg, #422AFB 0%, #7551FF 100%)' : 'transparent'}
                                boxShadow={isActive ? '0 2px 8px -2px rgba(66,42,251,0.45)' : 'none'}
                                _hover={{ bg: isActive ? undefined : 'rgba(66,42,251,0.08)', color: isActive ? 'white' : 'brand.500' }}
                                transition="all 0.15s ease"
                                onClick={() => { gotoPage(page - 1); setGopageValue(page); }}
                                display="flex"
                                alignItems="center"
                                justifyContent="center"
                            >
                                {page}
                            </Box>
                        );
                    })}

                    <Tooltip label="Next page" hasArrow>
                        <IconButton
                            size="sm"
                            variant="ghost"
                            borderRadius="8px"
                            onClick={() => { nextPage(); setGopageValue((p) => p + 1); }}
                            isDisabled={!canNextPage}
                            icon={<ChevronRightIcon h={5} w={5} />}
                            _hover={{ bg: 'rgba(66,42,251,0.08)', color: 'brand.500' }}
                            aria-label="Next page"
                        />
                    </Tooltip>
                    <Tooltip label="Last page" hasArrow>
                        <IconButton
                            size="sm"
                            variant="ghost"
                            borderRadius="8px"
                            onClick={() => { gotoPage(pageCount - 1); setGopageValue(pageCount); }}
                            isDisabled={!canNextPage}
                            icon={<ArrowRightIcon h={2.5} w={2.5} />}
                            _hover={{ bg: 'rgba(66,42,251,0.08)', color: 'brand.500' }}
                            aria-label="Last page"
                        />
                    </Tooltip>
                </Flex>
            )}
        </Flex>
    );
};

export default Pagination;
