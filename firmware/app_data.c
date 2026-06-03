/* Responsabilidad: Almacenar el estado global de la aplicación */

/* typedef struct
{
    float temperatura;
    float humedad;
} app_data_t;

Funciones típicas:

void app_data_init(void);

void app_data_set_temperature(float t);

void app_data_set_humidity(float h);

app_data_t app_data_get(void);

Internamente:

static app_data_t data;
static SemaphoreHandle_t mutex;

Nadie accede directamente a las variables. */