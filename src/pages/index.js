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
  Icon,
} from '@chakra-ui/core'
import styled from '@emotion/styled'
import Layout from '../components/Layout'
import SEO from '../components/Seo'
import fishes from '../data/fishes.json'
import bugs from '../data/bugs.json'

const data = [
  ...fishes.map((d) => ({
    ...d,
    type: 'fish',
  })),
  ...bugs.map((d) => ({
    ...d,
    type: 'bug',
  })),
]

const TableWrapper = styled(Box)`
  overflow: auto;

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
const formatBells = new Intl.NumberFormat()

const columns = [
  {
    accessor: 'type',
    Filter: ({ column: { filterValue = ['fish', 'bug'], setFilter } }) => {
      const onChange = (e) => {
        const { checked, value } = e.target

        // When removing all type we actually set them all back
        if (!checked && filterValue.length === 1) {
          setFilter(['fish', 'bug'])
          return
        }

        setFilter(
          checked
            ? [...filterValue, value]
            : filterValue.filter((d) => d !== value),
        )
      }

      return (
        <FormControl mr={2}>
          Type
          <Stack height={10} isInline>
            <Checkbox
              isChecked={filterValue.includes('fish')}
              value="fish"
              onChange={onChange}
            >
              Fish
            </Checkbox>
            <Checkbox
              isChecked={filterValue.includes('bug')}
              value="bug"
              onChange={onChange}
            >
              Bug
            </Checkbox>
          </Stack>
        </FormControl>
      )
    },
    filter: 'includes',
  },
  {
    Header: 'Name',
    accessor: 'name',
    disableFilters: true,
    Cell: ({ cell, row }) => {
      return (
        <Stack isInline alignItems="center">
          {row.original.image && (
            <img src={row.original.image} alt={cell.value} lazy="true" />
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
          <FormLabel display={['block', 'inline-block']}>
            Location
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
    disableFilters: true,
  },
  {
    Header: 'Months',
    accessor: 'months',
    width: 100,
    disableFilters: true,
    disableSortBy: true,
    Cell: ({ cell }) => {
      return (
        <Flex>
          {cell.value.map((month, i) => (
            <Box
              key={i}
              height={3}
              width={100 / 12 + '%'}
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
        placeholder={`Search ${count} animals...`}
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
  const currentMonth = now.getMonth()
  const currentHour = now.getHours()
  const timeRegExp = /(\d*) (\w*) - (\d*) (\w*)/

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
        const catchingTime = row.values.time
        if (catchingTime === 'All day') return true

        // Badly formatted or unknown time
        if (!timeRegExp.test(catchingTime)) return false

        let [, from, meridiem, to] = catchingTime.match(timeRegExp)
        from = parseInt(from)
        to = parseInt(to)

        if (meridiem === 'AM') {
          if (currentHour < from || currentHour > to + 11) {
            return false
          }
        } else {
          if (currentHour > to && currentHour < from + 12) {
            return false
          }
        }

        return true
      })
  )
}

const HomePage = () => {
  const {
    getTableProps,
    getTableBodyProps,
    headers,
    headerGroups,
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
      initialState: {
        hiddenColumns: ['type'],
      },
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

        <Flex direction={['column', 'row']} my={4}>
          {headers.map((column) =>
            column.canFilter ? column.render('Filter') : null,
          )}
        </Flex>

        <TableWrapper>
          <table {...getTableProps()}>
            <thead>
              {/* We have to use headerGroups because of a bug that doesn't hide the th of hidden columns */}
              {headerGroups.map((headerGroup) => (
                <tr {...headerGroup.getHeaderGroupProps()}>
                  {headerGroup.headers.map((column) => (
                    <th
                      {...column.getHeaderProps(column.getSortByToggleProps())}
                    >
                      <Box whiteSpace="nowrap">
                        {column.render('Header')}
                        {column.isSorted ? (
                          column.isSortedDesc ? (
                            <Icon name="chevron-up" />
                          ) : (
                            <Icon name="chevron-down" />
                          )
                        ) : null}
                      </Box>
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody {...getTableBodyProps()}>
              {rows.map((row) => {
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
      </Box>
    </Layout>
  )
}

export default HomePage
