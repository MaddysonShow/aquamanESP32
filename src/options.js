export const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
        x: {
            type: 'time',
            time: {
                unit: 'minute',
                displayFormats: {
                    minute: 'HH:mm', // 24-часовой формат
                    hour: 'HH:mm'
                },
                tooltipFormat: 'HH:mm'
            },
            ticks: {
                source: 'data',
                autoSkip: false,
                maxRotation: 45, // Поворот на 90 градусов
                minRotation: 45, // Вертикальные метки
                font: {
                    size: 12 // Уменьшаем размер шрифта
                },
            },
            // Настройки распределения пространства
            offset: false,
        },
        y: {
            border: {dash: [4,4]},
            grid: {
                color: '#aaf', // for the grid lines
                tickColor: '#000', // for the tick mark
                tickBorderDash: [2, 3], // also for the tick, if long enough
                tickLength: 10, // just to see the dotted line
                tickWidth: 2,
                offset: false,
                drawTicks: true, // true is default
                drawOnChartArea: true // true is default
            },
            min: 0,
            max: 100
        }
    },
    plugins: {
        legend: { position: 'top' },
        title: { display: false },
        zoom: {
            limits: {
                x: { min: 'original', max: 'original' } // Ограничения масштаба
            },
            pan: {
                enabled: true,
                mode: 'x',
                modifierKey: 'ctrl',
                scaleMode: "x",
            },
            zoom: {
                scaleMode: "x",
                speed: 1,
                wheel: {
                    enabled: true,
                },
                pinch: {
                    enabled: true,
                },
                drag: {
                    enabled: true,
                },
                mode: 'x',
            }
        }
    },
    interaction: {
        mode: 'nearest',
        axis: 'x',
        intersect: false
    }
};