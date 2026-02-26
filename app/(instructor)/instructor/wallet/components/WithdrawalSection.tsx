"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Building2, CreditCard, CalendarClock } from "lucide-react";

interface WithdrawalSectionProps {
  lastPayoutAt?: string | null;
}

export function WithdrawalSection({ lastPayoutAt }: WithdrawalSectionProps) {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Rút tiền</CardTitle>
          <CardDescription>
            Rút tiền về tài khoản ngân hàng liên kết
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 border rounded-lg bg-muted/50">
            <div className="flex items-center gap-3">
              <Building2 className="h-8 w-8 text-muted-foreground" />
              <div>
                <p className="font-medium">Vietcombank</p>
                <p className="text-sm text-muted-foreground">**** **** **** 1234</p>
              </div>
            </div>
          </div>
          <Button className="rounded-full w-full bg-brand-magenta hover:bg-brand-magenta/90">
            Yêu cầu rút tiền
          </Button>
          {lastPayoutAt && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground justify-center pt-2">
              <CalendarClock className="h-4 w-4" />
              <span>Lần rút gần nhất: {new Date(lastPayoutAt).toLocaleDateString('vi-VN')}</span>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Phương thức thanh toán</CardTitle>
        </CardHeader>
        <CardContent>
          <Button variant="outline" className="rounded-full w-full gap-2">
            <CreditCard className="h-4 w-4" />
            Quản lý tài khoản
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
