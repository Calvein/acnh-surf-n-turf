import React, { Fragment, useState } from 'react'
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

let caughtAnimals =
  typeof window === 'undefined'
    ? []
    : JSON.parse(localStorage.getItem('caughtAnimals')) || []
const rawData = [
  ...fishes.map((d) => ({
    ...d,
    type: 'fish',
  })),
  ...bugs.map((d) => ({
    ...d,
    type: 'bug',
  })),
].map((animal) => ({
  ...animal,
  caught: caughtAnimals.includes(animal.name),
}))

// See: https://github.com/chakra-ui/chakra-ui/issues/417
const FixedSelect = styled(Select)`
  option {
    color: initial;
  }
`

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
      /* Gray 500 */
      border-color: #718096;
    }
  }

  .light-mode & {
    table,
    th,
    td {
      /* Gray 400 */
      border-color: #a0aec0;
    }
  }
`

const locations = [...new Set(rawData.map((d) => d.location).sort())]
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
    rawData
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
            <FixedSelect
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
            </FixedSelect>
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
            <FixedSelect
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
            </FixedSelect>
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
            <FixedSelect
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
            </FixedSelect>
          </FormLabel>
        </FormControl>
      )
    },
  },
  {
    Header: 'Caught',
    accessor: 'caught',
    width: 75,
    sortType: 'basic',
    Cell: ({ cell, onCaughtAnimal }) => {
      const animal = cell.row.values.name

      return (
        <Flex justifyContent="center">
          <Checkbox
            isChecked={cell.value}
            value={animal}
            onChange={onCaughtAnimal}
          />
        </Flex>
      )
    },
    filter: (rows, id, filterValue) => {
      if (!filterValue) return rows

      return rows.filter((row) => !row.values.caught)
    },
    Filter: ({ column: { setFilter, filterValue } }) => {
      return (
        <FormControl mr={2}>
          Not caught
          <Stack height={10} isInline>
            <Checkbox
              isChecked={filterValue}
              onChange={(e) => setFilter(e.target.checked)}
            />
          </Stack>
        </FormControl>
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
      <Flex direction={['column', 'row']}>
        <Checkbox
          mr={4}
          onChange={(e) => {
            setGlobalFilter({
              ...globalFilter,
              isAvailableNow: e.target.checked,
            })
          }}
        >
          Is available now?
        </Checkbox>
        <Checkbox
          onChange={(e) => {
            setGlobalFilter({
              ...globalFilter,
              isSouthernHemisphere: e.target.checked,
            })
          }}
        >
          Is southern hemisphere ?
        </Checkbox>
      </Flex>
    </Stack>
  )
}

const globalFilter = (
  rows,
  ids,
  { filterText, isAvailableNow, isSouthernHemisphere },
) => {
  const now = new Date()
  let currentMonth = now.getMonth()
  if (isSouthernHemisphere) {
    currentMonth = (currentMonth + 6) % 11
  }
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
        // if (!row.values.months[currentMonth]) return false
        if (!row.values.months[currentMonth]) return false

        // Check current hour
        const catchingTime = row.values.time
        if (catchingTime.toLowerCase() === 'all day') return true

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
  const [data, setData] = useState(rawData)

  const onCaughtAnimal = (e) => {
    const { value, checked } = e.target

    setData((data) => {
      caughtAnimals = checked
        ? [...caughtAnimals, value]
        : caughtAnimals.filter((d) => d !== value)
      localStorage.setItem('caughtAnimals', JSON.stringify(caughtAnimals))

      return data.map((d) => {
        if (d.name !== value) return d

        return {
          ...d,
          caught: checked,
        }
      })
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
                    data-is-caught={row.values.caught ? true : null}
                  >
                    {row.cells.map((cell) => (
                      <td {...cell.getCellProps()}>
                        <cell.column.Cell
                          cell={cell}
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
