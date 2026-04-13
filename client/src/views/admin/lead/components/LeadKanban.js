import React, { useState, useEffect } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { Box, Flex, Text, Badge, Avatar, useColorModeValue, useColorMode, IconButton, Tooltip } from "@chakra-ui/react";
import { PhoneIcon, EmailIcon } from "@chakra-ui/icons";
import { putApi } from "services/api";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const columnsConfig = {
    pending: { name: "Pending", color: "orange.100", headerColor: "orange.500" },
    active: { name: "Active", color: "blue.100", headerColor: "blue.500" },
    sold: { name: "Sold", color: "green.100", headerColor: "green.500" },
};

const LeadKanban = ({ data, fetchData }) => {
    const [columns, setColumns] = useState({});
    const navigate = useNavigate();

    const bgCard = useColorModeValue("white", "gray.700");
    const textColor = useColorModeValue("secondaryGray.900", "white");
    const { colorMode } = useColorMode();
    const bgCol = colorMode === "light" ? "gray.50" : "gray.800";
    const borderColorCard = colorMode === "light" ? "gray.200" : "gray.600";

    useEffect(() => {
        const initialColumns = {
            pending: [],
            active: [],
            sold: [],
        };
        (data || []).forEach(lead => {
            const status = lead.leadStatus || "pending";
            if (initialColumns[status]) {
                initialColumns[status].push(lead);
            } else {
                initialColumns["pending"].push(lead);
            }
        });
        setColumns(initialColumns);
    }, [data]);

    const onDragEnd = async (result, columns, setColumns) => {
        if (!result.destination) return;
        const { source, destination } = result;

        if (source.droppableId !== destination.droppableId) {
            const sourceColumn = columns[source.droppableId];
            const destColumn = columns[destination.droppableId];
            const sourceItems = [...sourceColumn];
            const destItems = [...destColumn];
            const [removed] = sourceItems.splice(source.index, 1);
            
            // Optimistic Update
            removed.leadStatus = destination.droppableId; 
            destItems.splice(destination.index, 0, removed);
            
            setColumns({
                ...columns,
                [source.droppableId]: sourceItems,
                [destination.droppableId]: destItems
            });

            try {
                await putApi(`api/lead/changeStatus/${removed._id}`, { leadStatus: destination.droppableId });
            } catch (error) {
                toast.error("Failed to update status");
                fetchData(); // Rollback
            }
        } else {
            const column = columns[source.droppableId];
            const copiedItems = [...column];
            const [removed] = copiedItems.splice(source.index, 1);
            copiedItems.splice(destination.index, 0, removed);
            setColumns({
                ...columns,
                [source.droppableId]: copiedItems
            });
        }
    };

    return (
        <Flex justify="center" w="100%" h="100%" overflowX="auto" gap={6} p={2}>
            <DragDropContext onDragEnd={result => onDragEnd(result, columns, setColumns)}>
                {Object.entries(columnsConfig).map(([columnId, config]) => {
                    const columnItems = columns[columnId] || [];
                    return (
                        <Box key={columnId} w="33%" minW="300px" bg={bgCol} borderRadius="16px" p={4} borderTop="4px solid" borderColor={config.headerColor} shadow="sm">
                            <Flex justify="space-between" align="center" mb={4}>
                                <Text fontSize="lg" fontWeight="bold" color={textColor}>{config.name}</Text>
                                <Badge colorScheme={config.headerColor.split(".")[0]} borderRadius="full" px={2}>{columnItems.length}</Badge>
                            </Flex>
                            
                            <Droppable droppableId={columnId}>
                                {(provided, snapshot) => (
                                    <Box
                                        {...provided.droppableProps}
                                        ref={provided.innerRef}
                                        minH="500px"
                                        bg={snapshot.isDraggingOver ? (colorMode === "light" ? config.color : "gray.700") : "transparent"}
                                        transition="background-color 0.2s ease"
                                        borderRadius="10px"
                                        p={1}
                                    >
                                        {columnItems.map((item, index) => (
                                            <Draggable key={item._id} draggableId={item._id} index={index}>
                                                {(provided, snapshot) => (
                                                    <Box
                                                        ref={provided.innerRef}
                                                        {...provided.draggableProps}
                                                        {...provided.dragHandleProps}
                                                        bg={bgCard}
                                                        p={4}
                                                        mb={3}
                                                        borderRadius="12px"
                                                        shadow={snapshot.isDragging ? "xl" : "md"}
                                                        opacity={snapshot.isDragging ? 0.9 : 1}
                                                        border="1px solid"
                                                        borderColor={borderColorCard}
                                                        _hover={{ shadow: "lg", transform: "translateY(-2px)" }}
                                                        transition="all 0.15s ease"
                                                    >
                                                        <Flex align="center" justify="space-between" mb={2}>
                                                            <Text fontWeight="bold" fontSize="md" color={textColor} cursor="pointer" onClick={() => navigate(`/leadView/${item._id}`)} _hover={{ color: "brand.500" }} noOfLines={1}>
                                                                {item.leadName || item.leadEmail}
                                                            </Text>
                                                        </Flex>
                                                        
                                                        {(item.leadEmail || item.leadPhoneNumber) && (
                                                            <Flex gap={2} mb={2}>
                                                                {item.leadPhoneNumber && (
                                                                    <Tooltip label={item.leadPhoneNumber}>
                                                                        <IconButton icon={<PhoneIcon />} size="xs" colorScheme="blue" variant="outline" borderRadius="full" />
                                                                    </Tooltip>
                                                                )}
                                                                {item.leadEmail && (
                                                                    <Tooltip label={item.leadEmail}>
                                                                        <IconButton icon={<EmailIcon />} size="xs" colorScheme="orange" variant="outline" borderRadius="full" />
                                                                    </Tooltip>
                                                                )}
                                                            </Flex>
                                                        )}
                                                        
                                                        <Text fontSize="xs" color="gray.500">
                                                            Score: {item.leadScore || "N/A"} | Source: {item.leadSource || "N/A"}
                                                        </Text>
                                                    </Box>
                                                )}
                                            </Draggable>
                                        ))}
                                        {provided.placeholder}
                                    </Box>
                                )}
                            </Droppable>
                        </Box>
                    );
                })}
            </DragDropContext>
        </Flex>
    );
};

export default LeadKanban;
