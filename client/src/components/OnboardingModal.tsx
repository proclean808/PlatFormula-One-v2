import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Rocket, Target, Users, Zap } from 'lucide-react'

interface OnboardingModalProps {
  isOpen: boolean
  onClose: () => void
}

export function OnboardingModal({ isOpen, onClose }: OnboardingModalProps) {
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    startupName: '',
    stage: '',
    industry: '',
    goal: ''
  })

  const handleNext = () => {
    if (step < 3) {
      setStep(step + 1)
    } else {
      onClose()
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold flex items-center gap-2">
            <Rocket className="w-6 h-6 text-emerald-500" />
            Welcome to PlatFormula.One
          </DialogTitle>
          <DialogDescription>
            Let's personalize your accelerator journey. Step {step} of 3
          </DialogDescription>
        </DialogHeader>

        <div className="py-6">
          {step === 1 && (
            <div className="space-y-4 animate-in fade-in slide-in-from-right-4">
              <div className="space-y-2">
                <Label htmlFor="startupName">Startup Name</Label>
                <Input 
                  id="startupName" 
                  placeholder="Enter your startup name"
                  value={formData.startupName}
                  onChange={(e) => setFormData({...formData, startupName: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="stage">Current Stage</Label>
                <Select onValueChange={(value) => setFormData({...formData, stage: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select your stage" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="idea">Idea Stage</SelectItem>
                    <SelectItem value="mvp">MVP / Prototype</SelectItem>
                    <SelectItem value="pre-seed">Pre-Seed</SelectItem>
                    <SelectItem value="seed">Seed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4 animate-in fade-in slide-in-from-right-4">
              <div className="space-y-2">
                <Label htmlFor="industry">Industry</Label>
                <Select onValueChange={(value) => setFormData({...formData, industry: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select your industry" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="saas">B2B SaaS</SelectItem>
                    <SelectItem value="fintech">Fintech</SelectItem>
                    <SelectItem value="health">HealthTech</SelectItem>
                    <SelectItem value="ai">Artificial Intelligence</SelectItem>
                    <SelectItem value="consumer">Consumer</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="goal">Primary Goal</Label>
                <Select onValueChange={(value) => setFormData({...formData, goal: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="What's your main focus?" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="accelerator">Get into Accelerator</SelectItem>
                    <SelectItem value="funding">Raise Funding</SelectItem>
                    <SelectItem value="cofounder">Find Co-Founder</SelectItem>
                    <SelectItem value="growth">User Growth</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="text-center space-y-4 animate-in fade-in slide-in-from-right-4">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto">
                <Zap className="w-8 h-8 text-emerald-600" />
              </div>
              <h3 className="text-xl font-semibold">You're All Set!</h3>
              <p className="text-muted-foreground">
                We've customized your dashboard based on your profile. Get ready to accelerate your startup journey.
              </p>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Skip</Button>
          <Button onClick={handleNext} className="bg-emerald-600 hover:bg-emerald-700 text-white">
            {step === 3 ? "Get Started" : "Next Step"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
