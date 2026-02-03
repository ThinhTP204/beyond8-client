
import { Button } from '@/components/ui/button'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"

interface DocumentUploadDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    metadata: {
        title: string
        description: string
        isDownloadable: boolean
    }
    setMetadata: (metadata: {
        title: string
        description: string
        isDownloadable: boolean
    }) => void
    onConfirm: () => void
    onCancel: () => void
    isLoading: boolean
}

export default function DocumentUploadDialog({
    open,
    onOpenChange,
    metadata,
    setMetadata,
    onConfirm,
    onCancel,
    isLoading
}: DocumentUploadDialogProps) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                    <DialogTitle>Tải tài liệu lên</DialogTitle>
                    <DialogDescription>
                        Nhập thông tin cho tài liệu của bạn.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="title" className="text-right">
                            Tiêu đề
                        </Label>
                        <Input
                            id="title"
                            value={metadata.title}
                            onChange={(e) => setMetadata({ ...metadata, title: e.target.value })}
                            className="col-span-3"
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="description" className="text-right">
                            Mô tả
                        </Label>
                        <Textarea
                            id="description"
                            value={metadata.description}
                            onChange={(e) => setMetadata({ ...metadata, description: e.target.value })}
                            className="col-span-3"
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="downloadable" className="text-right">
                            Cho phép tải
                        </Label>
                        <div className="flex items-center space-x-2 col-span-3">
                            <Switch
                                id="downloadable"
                                checked={metadata.isDownloadable}
                                onCheckedChange={(checked) => setMetadata({ ...metadata, isDownloadable: checked })}
                            />
                            <Label htmlFor="downloadable">
                                {metadata.isDownloadable ? 'Có' : 'Không'}
                            </Label>
                        </div>
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="outline" className='rounded-full hover:bg-gray-100 hover:text-black' onClick={onCancel} disabled={isLoading}>
                        Hủy bỏ
                    </Button>
                    <Button className='rounded-full hover:bg-primary/90' onClick={onConfirm} disabled={isLoading}>
                        {isLoading ? 'Đang tải lên...' : 'Lưu tài liệu'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
