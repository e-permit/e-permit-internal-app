import { ChevronLeftIcon, ChevronRightIcon } from "@chakra-ui/icons";
import { Box, Flex, IconButton, NumberDecrementStepper, NumberIncrementStepper, NumberInput, NumberInputField, NumberInputStepper, Spinner, Table, Tbody, Td, Text, Th, Thead, Tooltip, Tr } from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import {
    PaginationState,
    useReactTable,
    getCoreRowModel,
    ColumnDef,
    flexRender,
} from '@tanstack/react-table';
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useAuth } from "../auth/RequireAuth";
type Permit = {
    "permit_id": string;
    "issued_at": string;
    "expire_at": string;
    "plate_number": string;
    "company_id": string;
    "company_name": string;
}

export default function PermitList() {
    const columns = useMemo<ColumnDef<Permit>[]>(
        () => [{
            accessorKey: 'permit_id',
            header: () => <span>Id</span>,
            footer: props => props.column.id,
        },
        {
            accessorKey: 'issued_at',
            header: () => <span>Issued At</span>,
            footer: props => props.column.id,
        },
        {
            accessorKey: 'expire_at',
            header: () => <span>Expire At</span>,
            footer: props => props.column.id,
        },
        {
            accessorKey: 'plate_number',
            header: () => <span>Plate Number</span>,
            footer: props => props.column.id,
        },
        {
            accessorKey: 'company_name',
            header: () => <span>Company Name</span>,
            footer: props => props.column.id,
        },
        {
            accessorKey: 'company_id',
            header: () => <span>Company Id</span>,
            footer: props => props.column.id,
        }
        ],
        []
    );
    const [{ pageIndex, pageSize }, setPagination] =
        useState<PaginationState>({
            pageIndex: 0,
            pageSize: 10,
        })

    const { resolveAxios } = useAuth();
    const { t } = useTranslation();
    const getPermits = async () => {
        const { data } = await resolveAxios()?.get(`/permits/`);
        return data;
    };

    const { data, error, isFetching } = useQuery(["permits"], () =>
        getPermits()
    );

    const defaultData = useMemo(() => [], [])

    const pagination = useMemo(
        () => ({
            pageIndex,
            pageSize,
        }),
        [pageIndex, pageSize]
    )

    const table = useReactTable({
        data: data?.rows ?? [],
        columns,
        pageCount: data?.page_count ?? -1,
        state: {
            pagination,
        },
        onPaginationChange: setPagination,
        getCoreRowModel: getCoreRowModel(),
        manualPagination: true,
        debugTable: true,
    });
    if (isFetching) return <Spinner />;
    return <Box>
        <Text
            fontSize={{ base: "14px", lg: "16px" }}
            color={"yellow.400"}
            fontWeight={"400"}
            textTransform={"uppercase"}
            ml={5}
            mb={"4"}
            mt={"5"}
        >
            Permits
        </Text>
        <Table>
            <Thead>
                {table.getHeaderGroups().map(headerGroup => (
                    <Tr key={headerGroup.id}>
                        {headerGroup.headers.map((header) => (
                            <Th key={header.id}>{header.isPlaceholder
                                ? null
                                : flexRender(
                                    header.column.columnDef.header,
                                    header.getContext()
                                )}</Th>
                        ))}
                    </Tr>
                ))}
            </Thead>
            <Tbody>
                {table.getRowModel().rows.map(row => {
                    return (
                        <Tr key={row.id}>
                            {row.getVisibleCells().map(cell => {
                                return (
                                    <Td key={cell.id}>
                                        {flexRender(
                                            cell.column.columnDef.cell,
                                            cell.getContext()
                                        )}
                                    </Td>
                                )
                            })}
                        </Tr>
                    )
                })}
            </Tbody>
        </Table>
        <Flex justifyContent="space-between" m={4} alignItems="center">
            <Flex>
                <Tooltip label="Previous Page">
                    <IconButton
                        aria-label="prev"
                        onClick={() => table.previousPage()}
                        disabled={!table.getCanPreviousPage()}
                        icon={<ChevronLeftIcon h={6} w={6} />}
                    />
                </Tooltip>
            </Flex>

            <Flex alignItems="center">
                <NumberInput ml={2}
                    mr={8}
                    w={28}
                    min={1}
                    max={table.getPageCount()}
                    onChange={(_, n) => {
                        const page = n ? n - 1 : 0;
                        table.setPageIndex(page)
                    }}
                    defaultValue={pageIndex + 1}
                >
                    <NumberInputField />
                    <NumberInputStepper>
                        <NumberIncrementStepper />
                        <NumberDecrementStepper />
                    </NumberInputStepper>
                </NumberInput>
            </Flex>

            <Flex>
                <Tooltip label="Next Page">
                    <IconButton
                        aria-label="next"
                        onClick={() => table.nextPage()}
                        isDisabled={!table.getCanNextPage()}
                        icon={<ChevronRightIcon h={6} w={6} />}
                    />
                </Tooltip>
            </Flex>
        </Flex>
    </Box>
}