import {
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
} from "@/components/ui";

interface DialogConfirmarBorrarBloqueProps {
  activeAlert: boolean;
  setActiveAlert: (active: boolean) => void;
  onDelete: () => void;
}

export default function DialogConfirmarBorrarBloque({
  activeAlert,
  setActiveAlert,
  onDelete,
}: DialogConfirmarBorrarBloqueProps) {
  return (
    <AlertDialog open={activeAlert} onOpenChange={setActiveAlert}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Estas seguro que quieres eliminar este bloque?
          </AlertDialogTitle>
          <AlertDialogDescription>
            Esta acción no se podrá deshacer.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction
            onClick={() => {
              onDelete();
              setActiveAlert(false);
            }}
          >
            Si, elimninar
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
