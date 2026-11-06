import type { Meta, StoryObj } from '@storybook/react-vite'
import { Badge } from './badge'
import { Table, TableBody, TableCaption, TableCell, TableFooter, TableHead, TableHeader, TableRow } from './table'

const invoices = [
  { id: 'INV-001', status: 'Paid', amount: '$250.00' },
  { id: 'INV-002', status: 'Pending', amount: '$150.00' },
  { id: 'INV-003', status: 'Overdue', amount: '$350.00' },
] as const

const statusVariant = { Paid: 'success', Pending: 'warning', Overdue: 'danger' } as const

const meta = {
  title: 'Components/Table',
  component: Table,
  parameters: { layout: 'padded' },
  render: (args) => (
    <Table {...args}>
      <TableCaption>Invoices from the last 30 days</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Invoice</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">Amount</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {invoices.map((invoice) => (
          <TableRow key={invoice.id}>
            <TableCell className="font-medium">{invoice.id}</TableCell>
            <TableCell>
              <Badge variant={statusVariant[invoice.status]}>{invoice.status}</Badge>
            </TableCell>
            <TableCell className="text-right">{invoice.amount}</TableCell>
          </TableRow>
        ))}
      </TableBody>
      <TableFooter>
        <TableRow>
          <TableCell colSpan={2}>Total</TableCell>
          <TableCell className="text-right">$750.00</TableCell>
        </TableRow>
      </TableFooter>
    </Table>
  ),
} satisfies Meta<typeof Table>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
