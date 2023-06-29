import { AddIcon, ChevronLeftIcon, ChevronRightIcon } from "@chakra-ui/icons";
import { Box, Flex, IconButton, NumberDecrementStepper, NumberIncrementStepper, NumberInput, NumberInputField, NumberInputStepper, Spinner, Table, Tbody, Td, Text, Th, Thead, Tooltip, Tr } from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import {
    PaginationState,
    useReactTable,
    getCoreRowModel,
    ColumnDef,
    flexRender,
} from '@tanstack/react-table';
import React, { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { PermitFilterProps } from "../../lib/PermitFilterProps";
import Create from "./Create";
import { PermitViewModal } from "./PermitView";
import { useAuth } from "../../lib/useAuth";
type Permit = {
    "permit_id": string;
    "issued_at": string;
    "expire_at": string;
    "plate_number": string;
    "company_id": string;
    "company_name": string;
}

export default ({ props }: { props: PermitFilterProps }) => {
    const { t } = useTranslation();
    const { resolveAxios } = useAuth();
    const columns = useMemo<ColumnDef<Permit>[]>(
        () => [{
            accessorKey: 'permit_id',
            header: () => <span>{t("permit.label.id")}</span>,
            width: 240,
            footer: props => props.column.id,
        },
        {
            accessorKey: 'issued_at',
            header: () => <span>{t("permit.label.issued_at")}</span>,
            footer: props => props.column.id,
        },
        {
            accessorKey: 'expire_at',
            header: () => <span>{t("permit.label.expire_at")}</span>,
            footer: props => props.column.id,
        },
        {
            accessorKey: 'plate_number',
            header: () => <span>{t("permit.label.plate_number")}</span>,
            footer: props => props.column.id,
        },
        {
            accessorKey: 'company_name',
            header: () => <span>{t("permit.label.company_name")}</span>,
            footer: props => props.column.id,
        },
        {
            accessorKey: 'company_id',
            header: () => <span>{t("permit.label.company_id")}</span>,
            footer: props => props.column.id,
        },
        {
            accessorKey: 'command',
            header: () => props.isOwner && <Create props={props} />,
            cell: props => <PermitViewModal id={props.row.getValue("permit_id")} />,
        }
        ],
        [props]
    );
    const [{ pageIndex, pageSize }, setPagination] =
        useState<PaginationState>({
            pageIndex: 0,
            pageSize: 10,
        })
    const pagination = useMemo(
        () => ({
            pageIndex,
            pageSize,
        }),
        [pageIndex, pageSize]
    )
    const fetchPermitsOptions = {
        page: pageIndex,
        issuer: props.isOwner ? props.authorityCode : props.selectedAuthorityCode,
        issued_for: props.isOwner ? props.selectedAuthorityCode : props.authorityCode,
        permit_year: props.permitYear,
        permit_type: props.permitType
    }

    const getPermits = async (options: any) => {
        const { data } = await resolveAxios()?.get(
            `/permits?page=${options.page}&&issuer=${options.issuer}` +
            `&&issued_for=${options.issued_for}&&permit_year=${options.permit_year}&&permit_type=${options.permit_type}`);
        return data;
    };

    const { data, error, isFetching } = useQuery(["permits", fetchPermitsOptions], () =>
        getPermits(fetchPermitsOptions)
    );

    const table = useReactTable({
        data: data?.content ?? [],
        columns,
        pageCount: data?.total_pages ?? -1,
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
            color={"yellow.500"}
            fontWeight={"400"}
            textTransform={"uppercase"}
            ml={5}
            mb={"4"}
            mt={"5"}
        >
            {t("Permits")}
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
                <Tooltip label={t("Previous Page")}>
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
                <Tooltip label={t("Next Page")}>
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