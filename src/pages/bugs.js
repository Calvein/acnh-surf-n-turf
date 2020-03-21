// TODO: Make Table & time more generic

import React from 'react'
import { useTable, useSortBy, useFilters, useGlobalFilter } from 'react-table'
import {
  Input,
  Box,
  Stack,
  Select,
  Checkbox,
  Flex,
  FormControl,
  FormLabel,
  Link,
  Icon,
  Text,
} from '@chakra-ui/core'
import styled from '@emotion/styled'
import Layout from '../components/Layout'
import SEO from '../components/Seo'
import data from '../data/bugs.json'

const TableWrapper = styled(Box)`
  overflow: auto;
  padding: 1rem 0;

  table {
    width: 100%;
    min-width: 500px;
    border-spacing: 0;
    border: 1px solid;

    tr {
      :last-child {
        td {
          border-bottom: 0;
        }
      }
    }

    th,
    td {
      margin: 0;
      padding: 0.5rem;
      border-bottom: 1px solid;
      border-right: 1px solid;

      :last-child {
        border-right: 0;
      }
    }
  }

  .dark-mode & {
    table,
    th,
    td {
      /* Gray 50 */
      border-color: #f7fafc;
    }
  }

  .light-mode & {
    table,
    th,
    td {
      /* Gray 900 */
      border-color: #171923;
    }
  }
`

const locations = [...new Set(data.map((d) => d.location))]
const times = [...new Set(data.map((d) => d.time).filter((d) => d !== '?'))]
const formatBells = new Intl.NumberFormat()

const columns = [
  {
    Header: 'Name',
    accessor: 'name',
    disableFilters: true,
    Cell: ({ cell, row }) => {
      return (
        <Stack isInline alignItems="center">
          {row.original.image && (
            <img src={row.original.image} alt={cell.value} lazy />
          )}
          <Box>{cell.value}</Box>
        </Stack>
      )
    },
  },
  {
    Header: 'Price',
    accessor: 'price',
    disableFilters: true,
    Cell: ({ cell }) => {
      return <Box textAlign="right">{formatBells.format(cell.value)}</Box>
    },
  },
  {
    Header: 'Location',
    accessor: 'location',
    Filter: ({ column: { setFilter } }) => {
      return (
        <FormControl>
          <FormLabel>
            Location?
            <Select
              onChange={(e) => {
                setFilter(e.target.value || undefined)
              }}
            >
              <option value="">All</option>
              {locations.map((location) => (
                <option key={location} value={location}>
                  {location}
                </option>
              ))}
            </Select>
          </FormLabel>
        </FormControl>
      )
    },
  },
  // The data is here but it's quite useless
  // { Header: 'Shadow size', accessor: 'shadow', disableFilters: true },
  {
    Header: 'Time',
    accessor: 'time',
    Filter: ({ column: { setFilter } }) => {
      return (
        <FormControl>
          <FormLabel>
            Time?
            <Select
              onChange={(e) => {
                setFilter(e.target.value || undefined)
              }}
            >
              <option value="">All</option>
              {times.map((time) => (
                <option key={time} value={time}>
                  {time}
                </option>
              ))}
            </Select>
          </FormLabel>
        </FormControl>
      )
    },
  },
  {
    Header: 'Months',
    accessor: 'months',
    width: 100,
    disableFilters: true,
    Cell: ({ cell }) => {
      return (
        <Flex>
          {cell.value.map((month, i) => (
            <Box
              key={i}
              height={3}
              width="8.33%"
              backgroundColor={month ? 'green.500' : 'red.500'}
            />
          ))}
        </Flex>
      )
    },
  },
]

const GlobalFilter = ({
  preGlobalFilteredRows,
  globalFilter,
  setGlobalFilter,
}) => {
  const count = preGlobalFilteredRows.length

  return (
    <Stack>
      <Input
        value={globalFilter?.filterText || ''}
        onChange={(e) => {
          setGlobalFilter({
            ...globalFilter,
            filterText: e.target.value || undefined,
          })
        }}
        placeholder={`Search ${count} fishes...`}
      />
      <Checkbox
        onChange={(e) => {
          setGlobalFilter({
            ...globalFilter,
            isAvailableNow: e.target.checked,
          })
        }}
      >
        Is available now?
      </Checkbox>
    </Stack>
  )
}

const globalFilter = (rows, ids, { filterText, isAvailableNow }) => {
  const now = new Date()
  const currentHour = now.getHours()
  const currentMonth = now.getMonth()

  return (
    rows
      // Filter text
      .filter((row) => {
        if (!filterText) return true

        return ids.some((id) => {
          const rowValue = row.values[id]
          return String(rowValue)
            .toLowerCase()
            .includes(String(filterText).toLowerCase())
        })
      })
      // Filter availability
      .filter((row) => {
        if (!isAvailableNow) return true

        // Check current month
        if (!row.values.months[currentMonth]) return false

        // Check current hour
        const fishingTime = row.values.time
        if (
          fishingTime === '4 AM - 9 PM' &&
          (currentHour < 4 || currentHour > 20)
        ) {
          return false
        }
        if (
          fishingTime === '9 AM - 4 PM' &&
          (currentHour < 9 || currentHour > 15)
        ) {
          return false
        }
        if (
          fishingTime === '4 PM - 9 AM' &&
          currentHour > 9 &&
          currentHour < 16
        ) {
          return false
        }
        if (
          fishingTime === '9 PM - 4 AM' &&
          currentHour > 4 &&
          currentHour < 20
        ) {
          return false
        }

        return true
      })
  )
}

const FishesPage = () => {
  const {
    getTableProps,
    getTableBodyProps,
    headers,
    prepareRow,
    rows,
    preGlobalFilteredRows,
    state,
    setGlobalFilter,
  } = useTable(
    {
      columns,
      data,
      globalFilter,
    },
    useGlobalFilter,
    useFilters,
    useSortBy,
  )

  return (
    <Layout>
      <SEO title="Fishes" />
      <Box>
        <GlobalFilter
          preGlobalFilteredRows={preGlobalFilteredRows}
          globalFilter={state.globalFilter}
          setGlobalFilter={setGlobalFilter}
        />

        <Stack isInline mt={4}>
          {headers.map((column) =>
            column.canFilter ? column.render('Filter') : null,
          )}
        </Stack>

        <TableWrapper>
          <table {...getTableProps()}>
            <thead>
              <tr>
                {headers.map((column) => (
                  <th {...column.getHeaderProps(column.getSortByToggleProps())}>
                    <Box whiteSpace="nowrap">
                      {column.render('Header')}
                      {column.isSorted
                        ? column.isSortedDesc
                          ? ' 🔽'
                          : ' 🔼'
                        : ''}
                    </Box>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody {...getTableBodyProps()}>
              {rows.map((row, i) => {
                prepareRow(row)
                return (
                  <tr {...row.getRowProps()}>
                    {row.cells.map((cell) => {
                      return (
                        <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                      )
                    })}
                  </tr>
                )
              })}
            </tbody>
          </table>
        </TableWrapper>

        <Text fontSize="sm">
          Data coming from{' '}
          <Link
            isExternal
            href="https://animalcrossing.fandom.com/wiki/Fish_(New_Horizons)"
            target="_blank"
          >
            https://animalcrossing.fandom.com/wiki/Fish_(New_Horizons)
            <Icon name="external-link" ml={2} />
          </Link>
        </Text>
      </Box>
    </Layout>
  )
}

export default FishesPage
