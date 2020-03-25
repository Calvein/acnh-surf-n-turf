import React, { useState, Fragment } from 'react'
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
  Link,
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
      &[data-is-caught] {
        opacity: 0.4;
      }
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
      /* Gray 400 */
      border-color: #a0aec0;
    }
  }

  .light-mode & {
    table,
    th,
    td {
      /* Gray 500 */
      border-color: #718096;
    }
  }
`

const locations = [...new Set(data.map((d) => d.location).sort())]
const formatBells = new Intl.NumberFormat()
const months = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
]
const shadows = [
  ...new Set(
    data
      .map((d) => d.shadow)
      .filter((d) => d)
      .sort(),
  ),
]

const columns = [
  {
    accessor: 'type',
    filter: 'includes',
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
  },
  {
    Header: 'Name',
    accessor: 'name',
    disableFilters: true,
    Cell: ({ cell }) => {
      return (
        <Stack
          as={Link}
          href={cell.row.original.url}
          isExternal
          target="_blank"
          isInline
          alignItems="center"
        >
          <Box width="64px" minHeight="64px">
            {cell.row.original.image && (
              <img src={cell.row.original.image} alt={cell.value} lazy="true" />
            )}
          </Box>
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
  {
    Header: 'Time',
    accessor: 'time',
    disableFilters: true,
  },
  {
    Header: 'Months',
    accessor: 'months',
    width: 100,
    disableSortBy: true,
    Cell: ({ cell }) => {
      const currentMonth = new Date().getMonth()

      return (
        <Flex>
          {cell.value.map((month, i) => (
            <Box
              key={i}
              ml="1px"
              height={3}
              width={100 / 12 + '%'}
              backgroundColor={month ? 'green.500' : 'red.500'}
              outline={i === currentMonth ? '1px solid red' : null}
            />
          ))}
        </Flex>
      )
    },
    filter: (rows, id, filterValue) => {
      if (filterValue == null) return rows

      return rows.filter((row) => {
        return row.values[id][filterValue]
      })
    },
    Filter: ({ column: { setFilter } }) => {
      return (
        <FormControl>
          <FormLabel display={['block', 'inline-block']}>
            Month
            <Select
              onChange={(e) => {
                setFilter(Number(e.target.value))
              }}
            >
              <option value="">All</option>
              {months.map((month, i) => (
                <option key={i} value={i}>
                  {month}
                </option>
              ))}
            </Select>
          </FormLabel>
        </FormControl>
      )
    },
  },
  {
    Header: 'Shadow size',
    accessor: 'shadow',
    filter: (rows, ids, filterValue) => {
      if (!filterValue) return rows

      return rows.filter((row) => {
        return ids.some((id) => row.values[id] === filterValue)
      })
    },
    Filter: ({ column: { setFilter } }) => {
      return (
        <FormControl>
          <FormLabel display={['block', 'inline-block']} minWidth="40">
            Shadow
            <Select
              onChange={(e) => {
                setFilter(e.target.value)
              }}
            >
              <option value="">All</option>
              {shadows.map((shadow) => (
                <option key={shadow} value={shadow}>
                  {shadow}
                </option>
              ))}
            </Select>
          </FormLabel>
        </FormControl>
      )
    },
  },
  {
    Header: 'Caught',
    accessor: (row) => `${row.name}-caught`,
    width: 75,
    disableFilters: true,
    disableSortBy: true,
    Cell: ({ cell, caughtAnimals, onCaughtAnimal }) => {
      const animal = cell.row.values.name

      return (
        <Flex justifyContent="center">
          <Checkbox
            defaultIsChecked={caughtAnimals.includes(animal)}
            value={animal}
            onChange={onCaughtAnimal}
          />
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
  const [caughtAnimals, setCaughtAnimals] = useState(
    () =>
      JSON.parse(
        typeof window === 'undefined'
          ? null
          : localStorage.getItem('caughtAnimals'),
      ) || [],
  )

  const onCaughtAnimal = (e) => {
    const { value, checked } = e.target

    setCaughtAnimals((caughtAnimals) => {
      const newCaughtAnimals = checked
        ? [...caughtAnimals, value]
        : caughtAnimals.filter((d) => d !== value)
      localStorage.setItem('caughtAnimals', JSON.stringify(newCaughtAnimals))

      return newCaughtAnimals
    })
  }

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
          {headers.map((column) => (
            <Fragment key={column.id}>
              {column.canFilter ? column.render('Filter') : null}
            </Fragment>
          ))}
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
                  <tr
                    {...row.getRowProps()}
                    data-is-caught={
                      caughtAnimals.includes(row.values.name) ? true : null
                    }
                  >
                    {row.cells.map((cell) => (
                      <td {...cell.getCellProps()}>
                        <cell.column.Cell
                          cell={cell}
                          caughtAnimals={caughtAnimals}
                          onCaughtAnimal={onCaughtAnimal}
                        />
                      </td>
                    ))}
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
