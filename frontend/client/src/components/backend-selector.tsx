import { useState, useEffect } from 'react';
import { useBackend } from '@/hooks/use-backend';
import { setCurrentBackend } from '@/lib/api-adapter';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Server } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export function BackendSelector() {
  const { t } = useTranslation();
  const { backend, setBackend } = useBackend();
  const [open, setOpen] = useState(false);
  
  // Sync the context state with the module-level state
  useEffect(() => {
    setCurrentBackend(backend);
  }, [backend]);
  
  const handleBackendChange = (value: 'nodejs' | 'java') => {
    setBackend(value);
    setOpen(false);
  };
  
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" size="icon" className="w-10 h-10">
          <Server className="h-4 w-4" />
          <span className="sr-only">{t('backendSelector.title')}</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-64" align="end">
        <div className="space-y-4">
          <h4 className="font-medium leading-none">
            {t('backendSelector.title')}
          </h4>
          <p className="text-sm text-muted-foreground">
            {t('backendSelector.description')}
          </p>
          <RadioGroup 
            defaultValue={backend} 
            value={backend}
            onValueChange={(value) => handleBackendChange(value as 'nodejs' | 'java')}
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="nodejs" id="nodejs" />
              <Label htmlFor="nodejs">Node.js</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="java" id="java" />
              <Label htmlFor="java">Java</Label>
            </div>
          </RadioGroup>
          <div className="text-xs text-muted-foreground">
            {t('backendSelector.currentBackend')}: {backend === 'nodejs' ? 'Node.js' : 'Java'}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}