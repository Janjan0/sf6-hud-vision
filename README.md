# SF6 HUD Lab

StreamMindAI — Plataforma completa + HUD Detection Lab



Quiero construir la aplicación web de StreamMindAI, una plataforma profesional de análisis de gameplay de Street Fighter 6.



IMPORTANTE:



Esto NO debe ser solamente una landing page ni una maqueta visual.



Quiero una aplicación funcional, modular y preparada para conectarse con nuestro backend Python/OpenCV posteriormente.



El procesamiento pesado de vídeo y la detección avanzada se terminarán posteriormente en Termux/Python. Lovable debe construir principalmente:



1. La plataforma web.

2. La interfaz de análisis.

3. El sistema de resultados.

4. El HUD Detection Lab.

5. La arquitectura de comunicación con el backend.

6. Los modelos de datos.

7. El sistema de debugging y visualización.



---



1. OBJETIVO DE STREAMMINDAI



StreamMindAI analiza vídeos de Street Fighter 6 para extraer información del combate.



El sistema final deberá poder detectar:



- P1 Health

- P2 Health

- P1 Drive Gauge

- P2 Drive Gauge

- P1 Super Gauge

- P2 Super Gauge

- Timer

- Round

- KO

- cambios de vida

- cambios de Drive

- eventos importantes

- highlights



Posteriormente utilizará esos datos para generar:



- estadísticas

- análisis de gameplay

- detección de errores

- recomendaciones

- entrenamiento personalizado mediante Coach IA



---



2. ARQUITECTURA GENERAL



La aplicación debe estar preparada para esta arquitectura:



VIDEO

↓

StreamMindAI Backend

↓

Frame Analyzer

↓

HUD Anchor Detector

↓

HUD Region Detector

↓

OCR / Computer Vision

↓

Event Detection

↓

Highlight Detection

↓

Gameplay Analysis

↓

Coach IA

↓

Frontend



El frontend NO debe intentar hacer el procesamiento pesado de vídeo.



Debe comunicarse con el backend mediante servicios/API claramente separados.



---



3. DASHBOARD



Crear dashboard principal.



Mostrar:



- Partidas analizadas

- Victorias

- Derrotas

- Win Rate

- Personaje principal

- Rival más frecuente

- Último análisis

- Highlights recientes

- Últimas partidas



Acciones:



- Analizar nuevo vídeo

- Historial

- HUD Detection Lab

- Coach IA

- Matchups

- Glosario



Priorizar claridad y utilidad sobre decoración.



---



4. ANALYZER



Ruta:



"/analyzer"



Permitir:



- subir vídeo

- drag & drop

- seleccionar archivo

- mostrar nombre

- mostrar tamaño

- mostrar duración

- reproducir vídeo

- iniciar análisis

- cancelar análisis

- volver a analizar



Estados:



- idle

- uploading

- processing

- detecting_hud

- analyzing

- generating_results

- completed

- error



Mostrar progreso real cuando el backend esté conectado.



No inventar progreso falso.



Si el backend no está conectado, indicar claramente:



"DEMO / BACKEND OFFLINE"



---



5. RESULTADO DEL ANÁLISIS



Ruta:



"/analysis/:id"



Mostrar:



Match



- Player

- Character

- Opponent

- Result

- Duration

- Rounds

- Date



HUD



Mostrar:



- P1 Health

- P2 Health

- P1 Drive

- P2 Drive

- P1 Super

- P2 Super

- Timer



Events



Timeline interactiva con:



- Damage

- Drive Damage

- Drive Impact

- Parry

- Counter

- Punish

- Punish Counter

- Knockdown

- Super

- Critical Art

- KO

- High Movement



Cada evento debe tener timestamp.



Al pulsarlo:



el vídeo debe saltar al timestamp correspondiente.



---



6. HIGHLIGHTS



Crear sección de highlights.



Cada highlight debe contener:



- timestamp

- duración

- tipo

- importancia

- descripción



Ejemplos:



- Huge Damage

- Drive Impact

- Perfect Parry

- Punish Counter

- Super

- Critical Art

- KO

- Major Life Swing

- Major Drive Swing



Botón:



"Watch Highlight"



Debe llevar el reproductor al momento correspondiente.



---



7. HUD DETECTION LAB



ESTA ES UNA DE LAS PARTES MÁS IMPORTANTES.



Crear una página:



"/hud-lab"



El objetivo es proporcionar una interfaz profesional para probar, visualizar y depurar el futuro detector HUD de StreamMindAI.



NO implementar un detector simplificado basado únicamente en coordenadas fijas.



La arquitectura debe respetar este principio:



ANCHOR FIRST



Primero detectar los anchors del HUD.



Después derivar las regiones de cada elemento en relación con esos anchors.



Nunca asumir que:



"P1 Health = x fijo"



"P2 Health = x fijo"



etc.



El vídeo puede tener:



- diferentes resoluciones

- diferentes escalados

- diferentes dimensiones

- diferentes capturas

- pequeños desplazamientos



El sistema debe utilizar coordenadas normalizadas y relaciones espaciales siempre que sea posible.



---



8. HUD LAB — VIDEO



Permitir:



- subir vídeo

- seleccionar vídeo existente

- reproducir

- pausar

- avanzar frame

- retroceder frame

- ir a timestamp

- cambiar FPS/frame

- seleccionar frame específico



Mostrar:



- resolución

- FPS

- duración

- frame actual

- timestamp



---



9. HUD OVERLAY



Sobre el vídeo mostrar las detecciones del backend.



Por ejemplo:



┌────────────────────────────────────┐

│ [P1 HEALTH]             [P2 HEALTH] │

│                                    │

│ [P1 DRIVE]               [P2 DRIVE] │

│                                    │

│             [TIMER]                │

│                                    │

│ [P1 SUPER]               [P2 SUPER] │

└────────────────────────────────────┘



Las cajas deben ser independientes y configurables.



Cada detección debe mostrar:



- bounding box

- nombre

- confidence

- anchor relacionado

- coordenadas normalizadas



Ejemplo:



"P1_HEALTH 98%"



"P2_DRIVE 91%"



---



10. ANCHOR SYSTEM



Crear visualización específica de anchors.



Los anchors pueden representar:



- P1 HUD anchor

- P2 HUD anchor

- Center/TIMER anchor

- otros anchors necesarios



Mostrar:



- posición

- confidence

- bounding box

- estado



Ejemplo:



"P1_ANCHOR ✓ 98%"



"P2_ANCHOR ✓ 97%"



"CENTER_ANCHOR ✓ 99%"



Si un anchor no es detectado:



"P1_ANCHOR ⚠ NOT DETECTED"



---



11. RELATIVE REGIONS



El frontend debe poder recibir regiones calculadas en relación con anchors.



Ejemplo conceptual:



P1 Anchor

 ├── Health Region

 ├── Drive Region

 └── Super Region



P2 Anchor

 ├── Health Region

 ├── Drive Region

 └── Super Region



Center Anchor

 └── Timer Region



No almacenar solamente coordenadas absolutas.



Preparar el modelo de datos para aceptar:



- anchor

- relativeX

- relativeY

- relativeWidth

- relativeHeight

- normalizedX

- normalizedY

- normalizedWidth

- normalizedHeight

- confidence



---



12. ELEMENT DETECTION



Cada elemento del HUD debe poder ser activado/desactivado visualmente.



Elementos:



- P1 Health

- P2 Health

- P1 Drive

- P2 Drive

- P1 Super

- P2 Super

- Timer

- Round

- KO



Mostrar tabla:



Element| Detected| Confidence| Anchor| Status

P1 Health| YES| 98%| P1| OK

P2 Health| YES| 97%| P2| OK

P1 Drive| YES| 72%| P1| WARNING

P2 Drive| YES| 91%| P2| OK

Timer| YES| 99%| CENTER| OK



---



13. CONFIDENCE



Cada detección debe aceptar un confidence score de:



"0 - 100"



Utilizar estados:



- Excellent

- Good

- Warning

- Failed



No usar solamente un booleano.



Esto será importante para depurar el detector real.



---



14. DEBUG MODE



Crear un modo:



"DEBUG"



Cuando esté activo mostrar:



- todos los anchors

- todas las regiones

- bounding boxes

- coordenadas

- confidence

- frame number

- timestamp

- resolución

- FPS

- detector version



También mostrar información técnica:



Detector: HUD Detector v1

Frame: 1342

Resolution: 1920x1080

FPS: 60

P1 Anchor: detected

P2 Anchor: detected

Center Anchor: detected



---



15. COMPARACIÓN DE DETECTORES



Preparar arquitectura para poder comparar:



"HUD Detector v1"



"HUD Detector v2"



"HUD Detector v3"



La interfaz debe permitir cambiar la versión del detector.



Posteriormente podremos conectar diferentes implementaciones Python.



---



16. FRAME-BY-FRAME DEBUGGING



El HUD Lab debe permitir analizar frames individuales.



Controles:



- Previous Frame

- Next Frame

- Play

- Pause

- Jump to Frame

- Jump to Timestamp



Esto es MUY importante para poder comprobar exactamente en qué frame falla una detección.



---



17. DETECTION HISTORY



Mostrar historial de detección por frame.



Ejemplo:



Frame 1200

P1 Health 98%

P2 Health 97%

P1 Drive 94%

P2 Drive 92%



Frame 1201

P1 Health 98%

P2 Health 96%

P1 Drive 94%

P2 Drive 92%



Esto permitirá posteriormente detectar cambios.



---



18. DETECTION EVENTS



Preparar estructura para detectar cambios:



HEALTH_CHANGE

DRIVE_CHANGE

SUPER_CHANGE

TIMER_CHANGE

KO

ROUND_START

ROUND_END



Cada evento debe contener:



- timestamp

- frame

- tipo

- jugador

- valor anterior

- valor nuevo

- confidence



---



19. BACKEND API



Crear una capa de servicios independiente.



Por ejemplo:



services/

  analysisService

  hudService

  matchupService

  glossaryService

  coachService



El frontend nunca debe depender directamente de componentes UI para comunicarse con el backend.



Preparar API para:



POST /api/analyze

GET /api/analysis/:id

GET /api/analysis/:id/events

GET /api/analysis/:id/highlights



POST /api/hud/analyze

GET /api/hud/:id

GET /api/hud/:id/frames

GET /api/hud/:id/detections



Estos endpoints son una arquitectura inicial; dejarla fácilmente modificable cuando conectemos nuestro backend real.



---



20. MOCK DATA



Crear datos DEMO únicamente para probar la interfaz.



Los mocks deben estar claramente separados.



Por ejemplo:



/mock

/services

/components



Nunca mezclar mock data con lógica de producción.



---



21. MATCHUPS



Ruta:



"/matchups"



Permitir:



- seleccionar personaje

- seleccionar rival

- ver matchup

- fortalezas

- debilidades

- consejos

- historial



Preparar para conectarlo posteriormente a la base de datos de StreamMindAI.



---



22. GLOSARIO



Ruta:



"/glossary"



Categorías:



- System Hits

- Mechanics

- Combos & Execution

- Strategies

- Frame Data



Debe permitir:



- búsqueda

- filtros

- categorías

- definiciones

- términos relacionados



Separar los datos de la interfaz.



Preparar para consumir posteriormente:



"knowledge/database/glossary/terms.json"



---



23. COACH IA



Ruta:



"/coach"



Mostrar:



Strengths



Weaknesses



Problems



Recommendations



Training Exercises



Cada recomendación debe poder estar vinculada a evidencia del análisis.



Ejemplo:



Problem:

Poor Drive management



Evidence:

Player lost 3400 Drive over 8 blocking sequences.



Recommendation:

Practice Drive management during blockstrings.



Priority:

HIGH



---



24. HISTORY



Ruta:



"/history"



Mostrar análisis anteriores.



Filtros:



- personaje

- rival

- victoria/derrota

- fecha

- highlights

- análisis completo



---



25. PROFILE



Ruta:



"/profile"



Mostrar:



- personaje principal

- rank

- win rate

- victorias

- derrotas

- fortalezas

- debilidades

- objetivos



---



26. PROGRESS



Mostrar evolución:



- Win Rate

- Damage

- Punishes

- Anti-Air

- Parry

- Drive Management

- Drive Impact

- errores



Los gráficos deben utilizar datos reales provenientes del backend cuando esté conectado.



---



27. MOBILE



La aplicación debe funcionar correctamente en Android.



Especialmente:



- HUD Lab

- Video player

- Analyzer

- Timeline

- Dashboard



El HUD Lab debe poder utilizarse aunque la pantalla sea pequeña.



En móvil:



- sidebar → bottom navigation o menú compacto

- paneles → stack vertical

- controles → botones grandes

- video → responsive



---



28. DISEÑO



Estética:



Professional Competitive Gaming + AI



Dark UI.



Debe sentirse como una herramienta utilizada por jugadores competitivos.



Evitar:



- landing page genérica

- exceso de gradientes

- exceso de animaciones

- tarjetas inútiles

- textos de marketing



La prioridad es:



FUNCTIONALITY > DEBUGGING > CLARITY > DESIGN



---



29. COMPONENTES REUTILIZABLES



Crear componentes reutilizables como:



VideoPlayer

Timeline

HUDOverlay

HUDRegion

AnchorMarker

DetectionBox

ConfidenceBadge

AnalysisCard

EventCard

HighlightCard

StatsCard

LoadingState

ErrorState

EmptyState



---



30. NO HACER



NO:



- hardcodear coordenadas del HUD como solución definitiva

- asumir una resolución específica

- crear un detector falso y presentarlo como IA

- poner toda la lógica dentro de componentes

- mezclar mock data con producción

- crear botones sin funcionalidad

- crear páginas únicamente decorativas



---



31. PREPARACIÓN PARA NUESTRO BACKEND PYTHON



El backend real será desarrollado posteriormente fuera de Lovable utilizando Python/OpenCV.



Por eso la aplicación debe tratar al backend como una fuente externa de datos.



El backend será responsable de:



- extracción de frames

- detección de anchors

- detección de regiones

- OCR

- análisis de colores

- análisis de barras

- detección de vida

- detección de Drive

- detección de Super

- timer

- eventos

- highlights



Lovable NO necesita resolver definitivamente estas funciones.



Necesita crear una excelente interfaz para consumirlas y depurarlas.



---



32. OBJETIVO DEL HUD LAB



El HUD Lab debe convertirse en nuestra herramienta principal para desarrollar y depurar el detector.



Queremos poder:



1. subir un vídeo

2. seleccionar un frame

3. ejecutar detector

4. ver anchors

5. ver regiones

6. ver confidence

7. revisar errores

8. avanzar al siguiente frame

9. comparar resultados

10. cambiar detector

11. identificar exactamente dónde falla



Esto debe ser tratado como una herramienta de desarrollo profesional, no como una simple página visual.



---



33. ORDEN DE IMPLEMENTACIÓN



Implementar primero:



FASE 1



- App shell

- Dashboard

- Navigation

- Analyzer

- Video player



FASE 2



- Analysis results

- Timeline

- Events

- Highlights



FASE 3



- HUD Detection Lab

- Video/frame controls

- HUD overlay

- Anchors

- Relative regions

- Confidence

- Debug mode



FASE 4



- Detection history

- Detector versions

- API layer



FASE 5



- Coach IA

- Matchups

- Glossary

- Profile

- Progress



---



34. RESULTADO ESPERADO



Al finalizar quiero tener una aplicación web que pueda utilizarse como:



StreamMindAI



para subir un vídeo de Street Fighter 6, analizarlo y visualizar los resultados.



Pero especialmente quiero que el:



HUD Detection Lab



quede listo para que posteriormente podamos conectar nuestro detector Python/OpenCV real desde Termux.



La interfaz debe estar preparada para evolucionar junto con el detector.



NO simplificar el sistema HUD a coordenadas fijas.



NO reemplazar el sistema de anchors por una solución rápida.



NO sacrificar la arquitectura por una demo visual.



Construir primero una base sólida y funcional que podamos continuar desarrollando fuera de Lovable.

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://sf6-hud-vision.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/7beb0ca6-b3d8-4ef3-8655-eccfd2efaf37).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
