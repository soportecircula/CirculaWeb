# Arquitectura de Usuarios, Empresas y Productores

**Fecha**: 2026-04-20  
**Estado**: Propuesta (requiere review y feedback)

---

## 1. Modelo conceptual

```
┌─────────────────────────────────────────────────────┐
│                   USUARIO (Login)                    │
│  • email (PK, único globalmente)                    │
│  • nombre completo                                  │
│  • contraseña (hash bcrypt)                         │
│  • is_active, is_superuser, created_at             │
└────────────────┬────────────────────────────────────┘
                 │ 1:N
                 ▼
┌─────────────────────────────────────────────────────┐
│         EMPRESA (entidad REP a registrar)            │
│  • id (PK)                                          │
│  • nit (UNIQUE, string)                             │
│  • razon_social (nombre empresa)                    │
│  • user_id (FK → Usuario) - propietario             │
│  • email_empresa, telefono, ciudad, pais            │
│  • status (pendiente, activo, inactivo)             │
│  • tipo_requerimiento (Diagnostico, Plan, etc)      │
│  • plan (individual, colectivo)                     │
│  • created_at, updated_at                           │
└────────────────┬────────────────────────────────────┘
                 │ 1:N
                 ▼
┌─────────────────────────────────────────────────────┐
│            PRODUCTOR (categoría dentro empresa)     │
│  • id (PK)                                          │
│  • empresa_id (FK → Empresa)                        │
│  • nombre (ej: "Productor de Plásticos")            │
│  • descripcion, codigo_externo                      │
│  • tipo_producto (clasificación REP)                │
│  • status (activo, inactivo)                        │
│  • created_at, updated_at                           │
└─────────────────────────────────────────────────────┘
```

---

## 2. Flujo de registro (con superusuario)

```
1. [Solicitud] Usuario externo llena formulario en landing
   ├─ Nombre, email, compañía, NIT, tipo de requerimiento
   └─ Se almacena en tabla REGISTRO_PENDIENTE (no entra a usuarios aún)

2. [Admin] Superusuario revisa solicitudes en dashboard
   ├─ Acepta ✓ → genera link de confirmación temporal
   └─ Rechaza ✗ → marca como rechazada

3. [Registro] Usuario hace click en link y llena:
   ├─ Confirma email
   ├─ Ingresa nombre completo
   ├─ Selecciona/confirma compañía + NIT
   ├─ Ingresa password + confirmar password
   ├─ Selecciona plan (individual/colectivo)
   └─ Se crea Usuario + Empresa en BD

4. [Dashboard] Usuario loguea y accede según plan
   ├─ Plan Individual → ve solo 1 productor (default)
   └─ Plan Colectivo → puede crear/gestionar N productores
```

---

## 3. Restricciones de integridad

| Restricción | Razón | Implementación |
|---|---|---|
| `email` único globalmente | Un usuario = un email en todo el sistema | UNIQUE constraint en tabla User |
| `nit` único globalmente | Una empresa = un NIT | UNIQUE constraint en tabla Empresa |
| Usuario propietario de Empresa | Un usuario crea su propia empresa (1:1 relación primaria) | `user_id NOT NULL` en Empresa |
| Plan define # productores | Plan individual → 1 productor, Plan colectivo → N | Validación en lógica/constraintUNIQUE |
| Email ≠ crédencial multiempresa | No "linked accounts" aún | Un email solo pertenece a 1 usuario |

---

## 4. Modelos SQLAlchemy 2.x

### User

```python
from sqlalchemy import String, Boolean, DateTime, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

class User(Base):
    __tablename__ = "user"
    
    id: Mapped[int] = mapped_column(primary_key=True)
    email: Mapped[str] = mapped_column(String(255), unique=True, nullable=False)
    nombre: Mapped[str] = mapped_column(String(255), nullable=False)
    hashed_password: Mapped[str] = mapped_column(String(255), nullable=False)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)
    is_superuser: Mapped[bool] = mapped_column(Boolean, default=False)
    created_at: Mapped[datetime] = mapped_column(DateTime, server_default=func.now())
    updated_at: Mapped[datetime] = mapped_column(DateTime, server_default=func.now(), onupdate=func.now())
    
    # Relación 1:N
    empresas: Mapped[list["Empresa"]] = relationship(back_populates="usuario", cascade="all, delete-orphan")
```

### Empresa

```python
class Empresa(Base):
    __tablename__ = "empresa"
    
    id: Mapped[int] = mapped_column(primary_key=True)
    nit: Mapped[str] = mapped_column(String(20), unique=True, nullable=False)
    razon_social: Mapped[str] = mapped_column(String(255), nullable=False)
    user_id: Mapped[int] = mapped_column(ForeignKey("user.id"), nullable=False)
    
    email_empresa: Mapped[str] = mapped_column(String(255))
    telefono: Mapped[str | None] = mapped_column(String(20))
    ciudad: Mapped[str | None] = mapped_column(String(100))
    pais: Mapped[str | None] = mapped_column(String(100))
    
    # Campos de registro
    tipo_requerimiento: Mapped[str] = mapped_column(String(50))  # "Diagnostico", "Plan", etc
    plan: Mapped[str] = mapped_column(String(20))  # "individual", "colectivo"
    status: Mapped[str] = mapped_column(String(20), default="activo")  # pendiente, activo, inactivo
    
    created_at: Mapped[datetime] = mapped_column(DateTime, server_default=func.now())
    updated_at: Mapped[datetime] = mapped_column(DateTime, server_default=func.now(), onupdate=func.now())
    
    # Relaciones
    usuario: Mapped["User"] = relationship(back_populates="empresas")
    productores: Mapped[list["Productor"]] = relationship(back_populates="empresa", cascade="all, delete-orphan")
```

### Productor

```python
class Productor(Base):
    __tablename__ = "productor"
    
    id: Mapped[int] = mapped_column(primary_key=True)
    empresa_id: Mapped[int] = mapped_column(ForeignKey("empresa.id"), nullable=False)
    
    nombre: Mapped[str] = mapped_column(String(255), nullable=False)
    descripcion: Mapped[str | None] = mapped_column(Text)
    codigo_externo: Mapped[str | None] = mapped_column(String(100))
    tipo_producto: Mapped[str] = mapped_column(String(100))  # Clasificación REP (plástico, papel, etc)
    status: Mapped[str] = mapped_column(String(20), default="activo")
    
    created_at: Mapped[datetime] = mapped_column(DateTime, server_default=func.now())
    updated_at: Mapped[datetime] = mapped_column(DateTime, server_default=func.now(), onupdate=func.now())
    
    # Relación
    empresa: Mapped["Empresa"] = relationship(back_populates="productores")
```

---

## 5. Schemas Pydantic (Solicitud de Registro)

### RegistroSolicitud (antes de aprobación - landing)

```python
from pydantic import BaseModel, EmailStr

class RegistroSolicitudCreate(BaseModel):
    nombre: str
    email: EmailStr
    razon_social: str
    nit: str
    tipo_requerimiento: str  # "Diagnostico", "Plan", etc
    # sin contraseña aún - se pide en paso 3

class RegistroSolicitudResponse(BaseModel):
    id: int
    nombre: str
    email: str
    razon_social: str
    nit: str
    status: str  # pendiente, aceptada, rechazada
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)
```

### RegistroUsuario (paso 3 - con link confirmado)

```python
class RegistroUsuarioCreate(BaseModel):
    nombre: str  # confirmado/editable
    password: str
    password_confirm: str
    plan: str  # "individual", "colectivo"
    # nit, razon_social, email vienen del token/link

class UserResponse(BaseModel):
    id: int
    email: str
    nombre: str
    is_active: bool
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)
```

### EmpresaResponse (después de registrar usuario)

```python
class EmpresaResponse(BaseModel):
    id: int
    nit: str
    razon_social: str
    email_empresa: str
    plan: str
    tipo_requerimiento: str
    status: str
    created_at: datetime
    # productores: list[ProductorResponse] = []  # opcional, si lo necesitas

    model_config = ConfigDict(from_attributes=True)
```

---

## 6. Endpoints claves

| Endpoint | Método | Descripción | Auth |
|---|---|---|---|
| `/solicitudes` | POST | Crear solicitud de registro (landing) | Pública |
| `/admin/solicitudes` | GET | Listar solicitudes pendientes | SuperUser |
| `/admin/solicitudes/{id}/aceptar` | PATCH | Aceptar y generar link | SuperUser |
| `/admin/solicitudes/{id}/rechazar` | PATCH | Rechazar solicitud | SuperUser |
| `/registro/confirmar/{token}` | GET | Validar token y mostrar formulario | Pública |
| `/registro` | POST | Crear usuario + empresa (con token válido) | Pública |
| `/auth/login` | POST | Login usuario | Pública |
| `/users/me` | GET | Datos del usuario autenticado | User |
| `/empresas/{id}` | GET | Detalles empresa del usuario | User |
| `/empresas/{id}/productores` | GET | Listar productores de empresa | User |
| `/empresas/{id}/productores` | POST | Crear productor (si plan=colectivo) | User |

---

## 7. Validaciones en el flujo

```python
# En CreateRegistroUsuario
def validate_password(v: str) -> str:
    if len(v) < 8:
        raise ValueError("Mínimo 8 caracteres")
    if not re.search(r"[A-Z]", v) or not re.search(r"\d", v):
        raise ValueError("Debe contener mayúscula y número")
    return v

# En CreateEmpresa
def validate_nit(nit: str) -> str:
    nit = nit.replace("-", "").replace(" ", "")
    if not nit.isdigit() or len(nit) != 10:
        raise ValueError("NIT inválido (debe ser 10 dígitos)")
    return nit

# En CreateProductor (si plan=individual, máximo 1)
async def create_productor(db: SessionDep, empresa_id: int, data: ProductorCreate):
    empresa = await crud_empresa.get(db, id=empresa_id)
    if empresa.plan == "individual" and len(empresa.productores) >= 1:
        raise HTTPException(status_code=400, detail="Plan individual permite solo 1 productor")
    return await crud_productor.create(db, obj_in=data)
```

---

## 8. Cambios necesarios en CLAUDE.md

**ANTES:**
```
Sin multi-business: no business_id, no memberships, no tenant.
```

**DESPUÉS:**
```
Modelo de empresa por usuario (1:N):
- Un usuario puede propietario de múltiples empresas (1:1 con email)
- Cada empresa tiene 1:N productores
- Plan (individual/colectivo) define cantidad de productores permitidos
- No hay "memberships" o roles dentro de una empresa (de momento)
```

---

## 9. Consideraciones futuras (MVP+)

- [ ] Múltiples usuarios por empresa (roles: Admin, Operario, Consultor)
- [ ] Linked accounts (mismo usuario con múltiples empresas)
- [ ] Invitaciones a colaboradores
- [ ] Auditoría de cambios por usuario
- [ ] API tokens para integraciones

---

## 10. Definición de Done (usuario + empresa)

- [ ] Migración Alembic creada (User, Empresa, Productor)
- [ ] CRUD en `app/crud/usuario.py`, `app/crud/empresa.py`, `app/crud/productor.py`
- [ ] Endpoints de solicitud y registro implementados
- [ ] Schemas Pydantic validados
- [ ] Generación de token de confirmación (JWT temporal)
- [ ] Tests de flujo completo
- [ ] Cliente ng-openapi regenerado
- [ ] UI de landing + registro conectada
- [ ] CLAUDE.md actualizado
