import { Box, Stack, Text, Icon, Link } from '@chakra-ui/react'
import {
  RiDatabaseLine,
  RiContactsLine,
  RiInputMethodLine,
  RiGitMergeLine,
} from 'react-icons/ri'
import NextLink from 'next/link'
export function Sidebar() {
  return (
    <Box as="aside" w="64" mr="8">
      <Stack spacing="12" align="flex-start">
        <Box>
          <Text fontWeight="bold" color="gray.400" fontSize="small">
            GERAL
          </Text>
          <Stack spacing="4" mt="8" align="stretch">
            <Link
              as={NextLink}
              display="flex"
              alignItems="center"
              textDecoration="inherit"
              href="/"
            >
              <Icon as={RiDatabaseLine} fontSize="20" />
              <Text ml="4" fontWeight="medium" decoration="none">
                Dashboard
              </Text>
            </Link>
            <Link
              as={NextLink}
              display="flex"
              alignItems="center"
              textDecoration="none"
              href="/"
            >
              <Icon as={RiContactsLine} fontSize="20" />
              <Text ml="4" fontWeight="medium">
                Usuários
              </Text>
            </Link>
          </Stack>
        </Box>
        <Box>
          <Text fontWeight="bold" color="gray.400" fontSize="small">
            AUTOMAÇÃO
          </Text>
          <Stack spacing="4" mt="8" align="stretch">
            <Link
              as={NextLink}
              display="flex"
              alignItems="center"
              textDecoration="inherit"
              href="/"
            >
              <Icon as={RiInputMethodLine} fontSize="20" />
              <Text ml="4" fontWeight="medium" decoration="none">
                Formulários
              </Text>
            </Link>
            <Link
              as={NextLink}
              display="flex"
              alignItems="center"
              textDecoration="none"
              href="/"
            >
              <Icon as={RiGitMergeLine} fontSize="20" />
              <Text ml="4" fontWeight="medium">
                Automação
              </Text>
            </Link>
          </Stack>
        </Box>
      </Stack>
    </Box>
  )
}
