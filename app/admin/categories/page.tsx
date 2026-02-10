"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ArrowLeftIcon, PencilIcon, PlusIcon, Trash2Icon } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface Category {
  id: string;
  name: string;
  createdAt: string;
  courseCount?: number;
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState("");
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await fetch("/api/categories?withCount=true");
      const data = await response.json();
      setCategories(data);
    } catch (error) {
      console.error("Error fetching categories:", error);
      toast.error("Error al cargar las categorías");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddCategory = async () => {
    if (!newCategoryName.trim()) {
      toast.error("El nombre de la categoría es requerido");
      return;
    }

    try {
      const response = await fetch("/api/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newCategoryName }),
      });

      if (!response.ok) {
        const error = await response.json();
        toast.error(error.error || "Error al crear la categoría");
        return;
      }

      const newCategory = await response.json();
      setCategories([...categories, newCategory]);
      setNewCategoryName("");
      setIsDialogOpen(false);
      toast.success("Categoría creada exitosamente");
    } catch (error) {
      console.error("Error:", error);
      toast.error("Error al crear la categoría");
    }
  };

  const handleUpdateCategory = async () => {
    if (!editingName.trim() || !editingId) {
      toast.error("El nombre de la categoría es requerido");
      return;
    }

    try {
      const response = await fetch(`/api/categories/${editingId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: editingName }),
      });

      if (!response.ok) {
        const error = await response.json();
        toast.error(error.error || "Error al actualizar la categoría");
        return;
      }

      const updatedCategory = await response.json();
      setCategories(
        categories.map((cat) => (cat.id === editingId ? updatedCategory : cat)),
      );
      setEditingId(null);
      setEditingName("");
      toast.success("Categoría actualizada exitosamente");
    } catch (error) {
      console.error("Error:", error);
      toast.error("Error al actualizar la categoría");
    }
  };

  const handleDeleteCategory = async () => {
    if (!deleteId) return;

    try {
      const response = await fetch(`/api/categories/${deleteId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const error = await response.json();
        toast.error(error.error || "Error al eliminar la categoría");
        return;
      }

      setCategories(categories.filter((cat) => cat.id !== deleteId));
      setDeleteId(null);
      toast.success("Categoría eliminada exitosamente");
    } catch (error) {
      console.error("Error:", error);
      toast.error("Error al eliminar la categoría");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link
          href="/admin"
          className={buttonVariants({ variant: "outline", size: "icon" })}
        >
          <ArrowLeftIcon className="size-4" />
        </Link>
        <h1 className="text-3xl font-bold">Gestionar Categorías</h1>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Categorías de Cursos</CardTitle>
            <CardDescription>
              Crea, edita y elimina las categorías disponibles
            </CardDescription>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <PlusIcon className="mr-2 size-4" />
                Nueva Categoría
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Crear Nueva Categoría</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="category-name">Nombre de la Categoría</Label>
                  <Input
                    id="category-name"
                    value={newCategoryName}
                    onChange={(e) => setNewCategoryName(e.target.value)}
                    placeholder="Ej: Lactancia Materna"
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setIsDialogOpen(false)}
                  >
                    Cancelar
                  </Button>
                  <Button onClick={handleAddCategory}>Crear</Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </CardHeader>

        <CardContent>
          {isLoading ? (
            <div className="text-muted-foreground py-8 text-center">
              Cargando categorías...
            </div>
          ) : categories.length === 0 ? (
            <div className="text-muted-foreground py-8 text-center">
              No hay categorías. ¡Crea una nueva!
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Fecha de Creación</TableHead>
                  <TableHead>Cursos</TableHead>
                  <TableHead className="w-24 text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {categories.map((category) => (
                  <TableRow key={category.id}>
                    <TableCell>
                      {editingId === category.id ? (
                        <Input
                          value={editingName}
                          onChange={(e) => setEditingName(e.target.value)}
                          className="w-64"
                        />
                      ) : (
                        category.name
                      )}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {new Date(category.createdAt).toLocaleDateString("es-ES")}
                    </TableCell>
                    <TableCell>
                      {category.courseCount && category.courseCount > 0 ? (
                        <div className="w-fit rounded bg-amber-50 px-2 py-1 text-xs text-amber-600">
                          {category.courseCount}{" "}
                          {category.courseCount === 1 ? "curso" : "cursos"}
                        </div>
                      ) : (
                        <span className="text-muted-foreground text-xs">
                          Sin cursos
                        </span>
                      )}
                    </TableCell>
                    <TableCell className="flex justify-end gap-2">
                      {editingId === category.id ? (
                        <>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setEditingId(null);
                              setEditingName("");
                            }}
                          >
                            Cancelar
                          </Button>
                          <Button size="sm" onClick={handleUpdateCategory}>
                            Guardar
                          </Button>
                        </>
                      ) : (
                        <>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => {
                              setEditingId(category.id);
                              setEditingName(category.name);
                            }}
                          >
                            <PencilIcon className="size-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="text-destructive"
                            disabled={
                              category.courseCount && category.courseCount > 0
                            }
                            title={
                              category.courseCount && category.courseCount > 0
                                ? "No se puede eliminar una categoría con cursos asociados"
                                : undefined
                            }
                            onClick={() => setDeleteId(category.id)}
                          >
                            <Trash2Icon className="size-4" />
                          </Button>
                        </>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <AlertDialog
        open={!!deleteId}
        onOpenChange={(open) => !open && setDeleteId(null)}
      >
        <AlertDialogContent>
          <AlertDialogTitle>Eliminar Categoría</AlertDialogTitle>
          <AlertDialogDescription>
            ¿Estás seguro de que deseas eliminar esta categoría? Esta acción no
            se puede deshacer.
          </AlertDialogDescription>
          <div className="flex justify-end gap-2">
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteCategory}
              className="bg-destructive"
            >
              Eliminar
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
