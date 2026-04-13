import { Box, Flex, Text } from '@chakra-ui/react'
import React from 'react'

const DataNotFound = ({ message, subMessage }) => {
    return (
        <Flex
            direction="column"
            alignItems="center"
            justifyContent="center"
            py={10}
            gap={3}
        >
            <Box
                w="64px"
                h="64px"
                borderRadius="full"
                bg="rgba(66,42,251,0.06)"
                display="flex"
                alignItems="center"
                justifyContent="center"
                fontSize="28px"
                sx={{
                    animation: 'float 3s ease-in-out infinite',
                    '@keyframes float': {
                        '0%, 100%': { transform: 'translateY(0px)' },
                        '50%': { transform: 'translateY(-6px)' },
                    }
                }}
            >
                🔍
            </Box>
            <Text fontSize="sm" fontWeight="700" color="gray.500">
                {message || 'No records found'}
            </Text>
            <Text fontSize="xs" color="gray.400" maxW="200px" textAlign="center">
                {subMessage || 'Try adjusting your search or filters'}
            </Text>
        </Flex>
    )
}

export default DataNotFound
