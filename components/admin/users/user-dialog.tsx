"use client";

import React from "react";

import { useEffect, useMemo, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Lock, X } from "lucide-react";
import type { LDAPUser, LDAPGroup } from "@/lib/types";

interface UserDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: LDAPUser | null;
  groups: LDAPGroup[];
  onSave: (input: { user: LDAPUser; password?: string }) => void;
}

export function UserDialog({
  open,
  onOpenChange,
  user,
  groups,
  onSave,
}: UserDialogProps) {
  const [password, setPassword] = useState("");
  const [groupSearch, setGroupSearch] = useState("");
  const [groupError, setGroupError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"general" | "groups">("general");
  const [serviceFilter, setServiceFilter] = useState<
    "all" | "ambari" | "ranger" | "hue" | "zeppelin" | "grafana" | "openmd" | "airflow" | "other"
  >("all");
  const groupSearchRef = React.useRef<HTMLInputElement | null>(null);
  const [formData, setFormData] = useState<Partial<LDAPUser>>({
    uid: "",
    cn: "",
    sn: "",
    givenName: "",
    mail: "",
    memberOf: [],
    enabled: true,
  });

  useEffect(() => {
    if (user) {
      const fallbackCn = (user.cn ?? "").trim();
      const hasGivenName = !!(user.givenName ?? "").trim();
      const hasSn = !!(user.sn ?? "").trim();

      if (!hasGivenName && fallbackCn) {
        const parts = fallbackCn.split(/\s+/).filter(Boolean);
        const derivedGivenName = parts[0] ?? fallbackCn;
        const derivedSn = parts.slice(1).join(" ");

        setFormData({
          ...user,
          givenName: derivedGivenName,
          sn: hasSn ? user.sn : derivedSn,
        });
      } else {
        setFormData(user);
      }
    } else {
      setFormData({
        uid: "",
        cn: "",
        sn: "",
        givenName: "",
        mail: "",
        memberOf: [],
        enabled: true,
      });
    }
    setPassword("");
    setGroupSearch("");
  }, [user, open]);

  const groupService = (
    cnValue: string,
  ): "ambari" | "ranger" | "hue" | "zeppelin" | "grafana" | "openmd" | "airflow" | "other" => {
    const cn = (cnValue || "").toLowerCase();
    if (cn.startsWith("ambari_")) return "ambari";
    if (cn.startsWith("ranger_")) return "ranger";
    if (cn.startsWith("hue") || cn.startsWith("hue_")) return "hue";
    if (cn.startsWith("zeppelin_")) return "zeppelin";
    if (cn.startsWith("grafana_")) return "grafana";
    if (cn.startsWith("openmd_")) return "openmd";
    if (cn.startsWith("airflow_")) return "airflow";
    return "other";
  };

  const ambariRoleAllowList = new Set([
    "cluster_admin",
    "cluster_operator",
    "cluster_user",
    "service_admin",
    "service_operator",
    "read_only",
  ]);

  const ambariRoleKeyFromCn = (cnValue: string): string => {
    return (cnValue ?? "").toLowerCase().replace(/^ambari_/, "").trim();
  };

  const serviceLabel: Record<ReturnType<typeof groupService>, string> = {
    ambari: "Ambari",
    ranger: "Ranger",
    hue: "Hue",
    zeppelin: "Zeppelin",
    grafana: "Grafana",
    openmd: "OpenMD",
    airflow: "Airflow",
    other: "Otros",
  };

  const serviceOrder: Array<ReturnType<typeof groupService>> = [
    "ambari",
    "ranger",
    "hue",
    "zeppelin",
    "grafana",
    "openmd",
    "airflow",
    "other",
  ];

  const visibleServices = useMemo(() => {
    if (serviceFilter === "all") return serviceOrder;
    return [serviceFilter];
  }, [serviceFilter]);

  const groupByDn = useMemo(() => {
    const map = new Map<string, LDAPGroup>();
    for (const g of groups) map.set(g.dn, g);
    return map;
  }, [groups]);

  function getGroupService(groupDn: string) {
    const group = groupByDn.get(groupDn);
    const cn = group?.cn || groupDn.split(",")[0].replace("cn=", "");
    return groupService(cn);
  }

  const serviceAssignedDn = useMemo(() => {
    const out: Partial<Record<ReturnType<typeof groupService>, string>> = {};
    for (const dn of (formData.memberOf || []) as string[]) {
      const svc = getGroupService(dn);
      if (svc !== "other" && !out[svc]) out[svc] = dn;
    }
    return out;
  }, [formData.memberOf, groupByDn]);

  const hasAmbariGroupAssigned = useMemo(() => {
    const dns = (formData.memberOf || []) as string[];
    return dns.some((dn) => getGroupService(dn) === "ambari");
  }, [formData.memberOf, groupByDn]);

  useEffect(() => {
    if (open && activeTab === "groups") {
      const id = window.setTimeout(() => groupSearchRef.current?.focus(), 0);
      return () => window.clearTimeout(id);
    }
  }, [open, activeTab]);

  const handleInputChange = (
    field: keyof LDAPUser,
    value: string | boolean | string[],
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleNameChange = (givenName: string, sn: string) => {
    const cn = `${givenName} ${sn}`.trim();
    setFormData((prev) => ({ ...prev, givenName, sn, cn }));
  };

  const handleGroupToggle = (groupDn: string, checked: boolean) => {
    setGroupError(null);

    const currentGroups = formData.memberOf || [];
    if (checked) {
      const svc = getGroupService(groupDn);
      if (svc !== "other") {
        const alreadyAssigned = currentGroups.some(
          (dn) => dn !== groupDn && getGroupService(dn) === svc,
        );
        if (alreadyAssigned) {
          setGroupError(
            `No se permite asignar más de un grupo para ${serviceLabel[svc]}. Elimina el grupo actual antes de asignar otro.`,
          );
          return;
        }
      }
      handleInputChange("memberOf", [...currentGroups, groupDn]);
    } else {
      handleInputChange(
        "memberOf",
        currentGroups.filter((g) => g !== groupDn),
      );
    }
  };

  const handleRemoveGroup = (groupDn: string) => {
    const currentGroups = formData.memberOf || [];
    handleInputChange(
      "memberOf",
      currentGroups.filter((g) => g !== groupDn),
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newUser: LDAPUser = {
      dn: user?.dn || `uid=${formData.uid},ou=people,dc=larioja,dc=org`,
      uid: formData.uid || "",
      cn: formData.cn || "",
      sn: formData.sn || "",
      givenName: formData.givenName || "",
      mail: formData.mail || undefined,
      memberOf: (formData.memberOf || []) as string[],
      enabled: true,
      createdAt: user?.createdAt,
      lastLogin: user?.lastLogin,
    };

    onSave({ user: newUser, password: password || undefined });
  };

  const getGroupName = (groupDn: string) => {
    const group = groupByDn.get(groupDn);
    return group?.cn || groupDn.split(",")[0].replace("cn=", "");
  };

  const stripServicePrefix = (cn: string) => {
    const v = cn ?? "";
    if (/^ambari_/i.test(v)) return v.replace(/^ambari_/i, "");
    if (/^ranger_/i.test(v)) return v.replace(/^ranger_/i, "");
    if (/^hue_/i.test(v)) return v.replace(/^hue_/i, "");
    if (/^zeppelin_/i.test(v)) return v.replace(/^zeppelin_/i, "");
    if (/^grafana_/i.test(v)) return v.replace(/^grafana_/i, "");
    if (/^openmd_/i.test(v)) return v.replace(/^openmd_/i, "");
    if (/^airflow_/i.test(v)) return v.replace(/^airflow_/i, "");
    return v;
  };

  const displayGroupNameFromDn = (groupDn: string) => {
    const cn = getGroupName(groupDn);
    return stripServicePrefix(cn);
  };

  const displayGroupCn = (group: LDAPGroup) => {
    return stripServicePrefix(group.cn);
  };

  const filteredGroups = useMemo(() => {
    const q = groupSearch.trim().toLowerCase();
    const base = groups.filter((g) => {
      const svc = groupService(g.cn);
      if (svc !== "ambari") return true;
      return ambariRoleAllowList.has(ambariRoleKeyFromCn(g.cn));
    });

    if (!q) return base;

    return base.filter((g) => {
      const cn = (g.cn || "").toLowerCase();
      const desc = (g.description || "").toLowerCase();
      return cn.includes(q) || desc.includes(q);
    });
  }, [groups, groupSearch]);

  const filteredGroupsByService = useMemo(() => {
    const out: Record<ReturnType<typeof groupService>, LDAPGroup[]> = {
      ambari: [],
      ranger: [],
      hue: [],
      zeppelin: [],
      grafana: [],
      openmd: [],
      airflow: [],
      other: [],
    };
    for (const g of filteredGroups) {
      out[groupService(g.cn)].push(g);
    }
    for (const k of Object.keys(out) as Array<keyof typeof out>) {
      out[k].sort((a, b) => a.cn.localeCompare(b.cn));
    }
    return out;
  }, [filteredGroups]);

  const assignedDnsByService = useMemo(() => {
    const out: Record<ReturnType<typeof groupService>, string[]> = {
      ambari: [],
      ranger: [],
      hue: [],
      zeppelin: [],
      grafana: [],
      openmd: [],
      airflow: [],
      other: [],
    };
    for (const dn of (formData.memberOf || []) as string[]) {
      out[getGroupService(dn)].push(dn);
    }
    for (const k of Object.keys(out) as Array<keyof typeof out>) {
      out[k].sort((a, b) => getGroupName(a).localeCompare(getGroupName(b)));
    }
    return out;
  }, [formData.memberOf, groupByDn]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-4xl bg-white">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>
              {user ? "Editar Usuario" : "Nuevo Usuario"}
            </DialogTitle>
            <DialogDescription>
              {user
                ? "Modifica los datos del usuario en el directorio LDAP."
                : "Añade un nuevo usuario al directorio LDAP."}
            </DialogDescription>
          </DialogHeader>

          <Tabs
            defaultValue="general"
            value={activeTab}
            onValueChange={(v) => setActiveTab(v as "general" | "groups")}
            className="mt-4"
          >
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="general">Información General</TabsTrigger>
              <TabsTrigger value="groups">Grupos</TabsTrigger>
            </TabsList>

            <TabsContent value="general" className="mt-4 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="givenName">Nombre</Label>
                  <Input
                    id="givenName"
                    value={formData.givenName || ""}
                    onChange={(e) =>
                      handleNameChange(e.target.value, formData.sn || "")
                    }
                    placeholder="Juan"
                    required
                    className="bg-white shadow-sm"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="sn">Apellidos</Label>
                  <Input
                    id="sn"
                    value={formData.sn || ""}
                    onChange={(e) =>
                      handleNameChange(formData.givenName || "", e.target.value)
                    }
                    placeholder="García López"
                    required
                    className="bg-white shadow-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="uid">ID de Usuario</Label>
                  <Input
                    id="uid"
                    value={formData.uid || ""}
                    onChange={(e) => handleInputChange("uid", e.target.value)}
                    placeholder="jgarcia"
                    required
                    disabled={!!user}
                    className="bg-white shadow-sm"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="mail">Correo Electrónico</Label>
                  <Input
                    id="mail"
                    type="email"
                    value={formData.mail || ""}
                    onChange={(e) => handleInputChange("mail", e.target.value)}
                    placeholder="jgarcia@larioja.org"
                    className="bg-white shadow-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="password">
                    {user ? "Nueva contraseña" : "Contraseña"}
                  </Label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder={user ? "(opcional)" : "(requerida)"}
                    required={!user}
                    className="bg-white shadow-sm"
                  />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="groups" className="mt-4 space-y-4">
            <div className="flex h-[500px] min-h-0 gap-4">
              {/* Left Column: Available Groups */}
              <div className="flex min-h-0 min-w-0 flex-1 flex-col gap-2 rounded-lg border bg-muted/30 p-3 overflow-hidden">
                <div className="flex items-center justify-between">
                  <Label className="font-semibold text-foreground">Disponibles</Label>
                  <span className="text-xs text-muted-foreground">
                    {filteredGroups.filter(g => !formData.memberOf?.includes(g.dn)).length} grupos
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <Button
                    type="button"
                    size="sm"
                    variant={serviceFilter === "all" ? "secondary" : "outline"}
                    onClick={() => setServiceFilter("all")}
                  >
                    Todos
                  </Button>
                  {serviceOrder.map((svc) => (
                    <Button
                      key={svc}
                      type="button"
                      size="sm"
                      variant={serviceFilter === svc ? "secondary" : "outline"}
                      onClick={() => setServiceFilter(svc)}
                    >
                      {serviceLabel[svc]}
                    </Button>
                  ))}
                </div>

                <Input
                  ref={groupSearchRef}
                  value={groupSearch}
                  onChange={(e) => setGroupSearch(e.target.value)}
                  placeholder="Buscar..."
                  className="h-8 bg-white"
                />
                <ScrollArea className="min-h-0 flex-1 rounded-md border bg-white">
                  <div className="p-2 space-y-4">
                    {visibleServices.map((svc) => {
                      const svcGroups = filteredGroupsByService[svc].filter(
                        (g) => !formData.memberOf?.includes(g.dn)
                      );
                      if (svcGroups.length === 0) return null;
                      
                      return (
                        <div key={svc}>
                          <div className="sticky top-0 z-10 bg-white pb-2 pt-1">
                            <h4 className="text-xs font-semibold uppercase text-muted-foreground tracking-wider">
                              {serviceLabel[svc]}
                            </h4>
                          </div>
                          <div className="grid gap-2">
                            {svcGroups.map((group) => (
                              (() => {
                                const svcKey = groupService(group.cn)
                                const assignedDn = serviceAssignedDn[svcKey]
                                const isBlocked =
                                  svcKey !== "other" && !!assignedDn && assignedDn !== group.dn

                                return (
                              <div
                                key={group.dn}
                                className={
                                  isBlocked
                                    ? "flex items-center justify-between rounded-md border p-2 opacity-60 bg-muted/30"
                                    : "flex cursor-pointer items-center justify-between rounded-md border p-2 hover:bg-accent hover:text-accent-foreground group"
                                }
                                onClick={() => {
                                  if (isBlocked) {
                                    setGroupError(
                                      `Ya tienes un grupo asignado para ${serviceLabel[svcKey]}. Elimina el grupo actual antes de asignar otro.`,
                                    )
                                    return
                                  }
                                  handleGroupToggle(group.dn, true)
                                }}
                              >
                                <div className="overflow-hidden">
                                  <p className="truncate text-sm font-medium">{displayGroupCn(group)}</p>
                                  {group.description && (
                                    <p className="truncate text-xs text-muted-foreground">{group.description}</p>
                                  )}
                                </div>
                                {isBlocked ? (
                                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                    <Lock className="h-3 w-3" />
                                    <span>Asignado</span>
                                  </div>
                                ) : (
                                  <Button
                                    size="icon"
                                    variant="ghost"
                                    className="h-6 w-6 opacity-0 group-hover:opacity-100"
                                  >
                                    <span className="text-lg">+</span>
                                  </Button>
                                )}
                              </div>
                                )
                              })()
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </ScrollArea>

                {groupError && (
                  <div className="rounded-md border border-destructive/30 bg-destructive/5 px-3 py-2 text-sm text-destructive">
                    {groupError}
                  </div>
                )}
              </div>

              {/* Right Column: Assigned Groups */}
              <div className="flex min-h-0 min-w-0 flex-1 flex-col gap-2 rounded-lg border bg-muted/30 p-3 overflow-hidden">
                <div className="flex items-center justify-between">
                  <Label className="font-semibold text-foreground">Asignados</Label>
                  <span className="text-xs text-muted-foreground">
                    {formData.memberOf?.length || 0} grupos
                  </span>
                </div>
                
                <ScrollArea className="min-h-0 flex-1 rounded-md border bg-white">
                  <div className="p-2 space-y-4">
                    {formData.memberOf && formData.memberOf.length > 0 ? (
                      visibleServices.map((svc) => {
                        const dns = assignedDnsByService[svc];
                        if (dns.length === 0) return null;

                        return (
                          <div key={svc}>
                            <div className="sticky top-0 z-10 bg-white pb-2 pt-1">
                              <h4 className="text-xs font-semibold uppercase text-muted-foreground tracking-wider">
                                {serviceLabel[svc]}
                              </h4>
                            </div>
                            <div className="grid gap-2">
                              {dns.map((groupDn) => (
                                <div
                                  key={groupDn}
                                  className="flex items-center justify-between rounded-md border p-2 bg-secondary/20"
                                >
                                  <span className="truncate text-sm font-medium">
                                    {displayGroupNameFromDn(groupDn)}
                                  </span>
                                  <Button
                                    size="icon"
                                    variant="ghost"
                                    className="h-6 w-6 text-muted-foreground hover:text-destructive"
                                    onClick={() => handleRemoveGroup(groupDn)}
                                  >
                                    <X className="h-4 w-4" />
                                  </Button>
                                </div>
                              ))}
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <div className="flex h-full flex-col items-center justify-center p-4 text-center text-sm text-muted-foreground opacity-50">
                        <p>No hay grupos seleccionados</p>
                      </div>
                    )}
                  </div>
                </ScrollArea>
              </div>
            </div>
          </TabsContent>
          </Tabs>

          <DialogFooter className="mt-6">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancelar
            </Button>
            <Button type="submit">
              {user ? "Guardar Cambios" : "Crear Usuario"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
