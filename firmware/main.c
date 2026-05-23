#include <stdio.h>
#include "freertos/FreeRTOS.h"
#include "freertos/task.h"

void pantalla_task(void *pvParameters)
{
    while(1)
    {
        printf("Pantalla OK\n");

        vTaskDelay(pdMS_TO_TICKS(1000));
    }
}

void app_main(void)
{
    xTaskCreate(
        pantalla_task,
        "pantalla_task",
        2048,
        NULL,
        1,
        NULL
    );
}