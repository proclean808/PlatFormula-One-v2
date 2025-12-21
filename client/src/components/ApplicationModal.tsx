import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Rocket } from 'lucide-react'

interface ApplicationModalProps {
  isOpen: boolean
  onClose: () => void
  acceleratorName?: string
}

export function ApplicationModal({ isOpen, onClose, acceleratorName = "Accelerator" }: ApplicationModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Rocket className="w-5 h-5 text-emerald-500" />
            Apply to {acceleratorName}
          </DialogTitle>
          <DialogDescription>
            Your common application data will be pre-filled. Review and customize for this specific program.
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="pitch">One-Line Pitch</Label>
            <Input id="pitch" defaultValue="We help B2B SaaS founders get into top accelerators using AI." />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="problem">The Problem</Label>
            <Textarea 
              id="problem" 
              className="h-24"
              defaultValue="Founders spend 100+ hours applying to accelerators with low success rates because they don't know what reviewers are looking for." 
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="solution">The Solution</Label>
            <Textarea 
              id="solution" 
              className="h-24"
              defaultValue="PlatFormula.One uses AI to analyze successful applications and guide founders through a structured building process, increasing acceptance rates by 3x." 
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Save Draft</Button>
          <Button className="bg-emerald-600 hover:bg-emerald-700 text-white">Submit Application</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
