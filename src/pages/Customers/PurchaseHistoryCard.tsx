import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";

import type { PurchaseTransaction } from "@/stores/customerStore";

interface PurchaseHistoryCardProps {
  transaction: PurchaseTransaction;
}

export function PurchaseHistoryCard({ transaction }: PurchaseHistoryCardProps) {
  const hasReturns = transaction.returns && transaction.returns.length > 0;

  return (
    <Card key={transaction.id} className="mb-4 border-l-4 border-l-primary">
      <CardHeader className="pb-3">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2">
          <div>
            <CardTitle className="text-lg font-semibold">
              Transaction #{transaction.id}
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              {format(new Date(transaction.transaction_date), "PPP p")}
            </p>
            {transaction.notes && (
              <p className="text-xs mt-1 text-muted-foreground italic">
                “{transaction.notes}”
              </p>
            )}
          </div>
          <div className="text-right text-sm space-y-1">
            <div>
              <span className="font-medium">Total Paid:</span>{" "}
              <span className="font-bold">₹{transaction.total_amount}</span>
            </div>
            <div>
              <span>Method:</span> {transaction.payment_method}
            </div>
            {Number(transaction.change_amount) > 0 && (
              <div className="text-green-600">
                Change: ₹{transaction.change_amount}
              </div>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <Accordion type="multiple" defaultValue={["items"]} className="w-full">
          {/* Items Section */}
          <AccordionItem value="items">
            <AccordionTrigger className="text-left font-medium">
              🛒 Items Purchased ({transaction.items.length})
            </AccordionTrigger>
            <AccordionContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b bg-muted/50">
                      <th className="text-left p-2 font-medium">Product</th>
                      <th className="text-right p-2 font-medium">Qty</th>
                      <th className="text-right p-2 font-medium">Unit Price</th>
                      <th className="text-right p-2 font-medium">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {transaction.items.map((item) => (
                      <tr key={item.id} className="border-b">
                        <td className="p-2">{item.product_name}</td>
                        <td className="text-right p-2">
                          {parseFloat(item.quantity).toFixed(2)}
                        </td>
                        <td className="text-right p-2">
                          ₹{parseFloat(item.unit_price).toFixed(2)}
                        </td>
                        <td className="text-right p-2 font-medium">
                          ₹{parseFloat(item.total_price).toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr>
                      <td colSpan={3} className="text-right p-2 font-semibold">
                        Subtotal:
                      </td>
                      <td className="text-right p-2 font-semibold">
                        ₹{parseFloat(transaction.subtotal).toFixed(2)}
                      </td>
                    </tr>
                    {parseFloat(transaction.discount_amount) > 0 && (
                      <tr>
                        <td colSpan={3} className="text-right p-2">
                          Discount:
                        </td>
                        <td className="text-right p-2 text-red-600">
                          -₹{parseFloat(transaction.discount_amount).toFixed(2)}
                        </td>
                      </tr>
                    )}
                    {parseFloat(transaction.tax_amount) > 0 && (
                      <tr>
                        <td colSpan={3} className="text-right p-2">
                          Tax:
                        </td>
                        <td className="text-right p-2">
                          ₹{parseFloat(transaction.tax_amount).toFixed(2)}
                        </td>
                      </tr>
                    )}
                    <tr className="font-bold border-t">
                      <td colSpan={3} className="text-right p-2">
                        Total:
                      </td>
                      <td className="text-right p-2">
                        ₹{parseFloat(transaction.total_amount).toFixed(2)}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Returns Section */}
          {hasReturns && (
            <AccordionItem value="returns">
              <AccordionTrigger className="text-left font-medium text-orange-600 hover:text-orange-700">
                🔄 Returns ({transaction.returns.length})
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-4 mt-2">
                  {transaction.returns.map((ret) => (
                    <Card
                      key={ret.id}
                      className="border-orange-200 bg-orange-50 rounded-md"
                    >
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-semibold text-orange-800">
                          Return #{ret.id} —{" "}
                          {format(new Date(ret.return_date), "PPP p")}
                        </CardTitle>
                        <p className="text-xs text-orange-700 mt-1">
                          Reason: {ret.reason}
                        </p>
                        <p className="text-xs">
                          Refunded: ₹{parseFloat(ret.refund_amount).toFixed(2)}{" "}
                          via {ret.refund_method}
                        </p>
                        {ret.notes && (
                          <p className="text-xs italic text-orange-600">
                            “{ret.notes}”
                          </p>
                        )}
                      </CardHeader>
                      <CardContent>
                        <Accordion type="single" collapsible>
                          <AccordionItem value="return-items">
                            <AccordionTrigger className="text-xs font-medium">
                              📦 Returned Items ({ret.items.length})
                            </AccordionTrigger>
                            <AccordionContent>
                              <div className="overflow-x-auto">
                                <table className="w-full text-xs">
                                  <thead>
                                    <tr className="border-b bg-orange-100">
                                      <th className="text-left p-2">Product</th>
                                      <th className="text-right p-2">Qty</th>
                                      <th className="text-right p-2">Refund</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {ret.items.map((ritem) => (
                                      <tr key={ritem.id} className="border-b">
                                        <td className="p-2">
                                          {ritem.product_name}
                                        </td>
                                        <td className="text-right p-2">
                                          {parseFloat(ritem.quantity).toFixed(
                                            2
                                          )}
                                        </td>
                                        <td className="text-right p-2 font-medium">
                                          ₹
                                          {parseFloat(
                                            ritem.total_price
                                          ).toFixed(2)}
                                        </td>
                                      </tr>
                                    ))}
                                  </tbody>
                                  <tfoot>
                                    <tr className="font-bold border-t">
                                      <td
                                        colSpan={2}
                                        className="text-right p-2"
                                      >
                                        Total Refund:
                                      </td>
                                      <td className="text-right p-2">
                                        ₹
                                        {parseFloat(ret.refund_amount).toFixed(
                                          2
                                        )}
                                      </td>
                                    </tr>
                                  </tfoot>
                                </table>
                              </div>
                            </AccordionContent>
                          </AccordionItem>
                        </Accordion>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          )}
        </Accordion>
      </CardContent>
    </Card>
  );
}
