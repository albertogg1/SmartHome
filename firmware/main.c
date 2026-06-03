extern void app_initialize(void)
{
    app_data_init();

    display_init();
    ui_init();

    sensor_init();

    start_sensor_task();
    start_ui_task();
}