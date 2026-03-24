import java.util.Scanner;

public class ExamenPrimerParcial {

    public static void main(String[] args) {

        Scanner sc = new Scanner(System.in);
        boolean continuar = true;

        final double PRECIO_LAMINADO = 13.45;
        final double PRECIO_MARMOLADO = 43.95;
        final double PRECIO_ACRILICO = 39.24;
        final double DESCUENTO = 0.0725;
        final double IVA = 0.16;

        while (continuar) {

            // MENÚ PRINCIPAL
            System.out.println("\n=== MENÚ PRINCIPAL ===");
            System.out.println("1. Nueva cotización");
            System.out.println("2. Salir");

            int opcionMenu = 0;

            while (true) {
                try {
                    System.out.print("Seleccione una opción (1-2): ");
                    opcionMenu = Integer.parseInt(sc.nextLine());

                    if (opcionMenu == 1 || opcionMenu == 2) {
                        break;
                    } else {
                        System.out.println("Opción inválida. Solo se permite 1 o 2.");
                    }

                } catch (Exception e) {
                    System.out.println("Entrada inválida. Debe ser un número (1 o 2).");
                }
            }

            if (opcionMenu == 2) {
                System.out.println("\nSaliendo del sistema...");
                break;
            }

            // VALIDACIÓN DEL NOMBRE
            String nombre;
            while (true) {
                System.out.print("Ingrese el nombre completo del comprador: ");
                nombre = sc.nextLine().trim();

                if (nombre.isEmpty()) {
                    System.out.println("El nombre no puede estar vacío.");
                    continue;
                }

                if (nombre.length() < 3 || nombre.length() > 40) {
                    System.out.println("El nombre debe tener entre 3 y 40 caracteres.");
                    continue;
                }

                if (!nombre.matches("[a-zA-ZÁÉÍÓÚáéíóúÑñ ]+")) {
                    System.out.println("El nombre solo puede contener letras y espacios.");
                    continue;
                }

                break;
            }

            // MEDIDAS
            double ancho = pedirNumero(sc, "Ingrese el ancho del piso (mayor a 1): ");
            double largo = pedirNumero(sc, "Ingrese el largo del piso (mayor a 1): ");

            double metrosCuadrados = ancho * largo;

            // TIPO DE PISO
            System.out.println("\nSeleccione el tipo de piso:");
            System.out.println("1. Laminado ($13.45 m²)");
            System.out.println("2. Marmolado ($43.95 m²)");
            System.out.println("3. Acrílico ($39.24 m²)");

            int opcionPiso = 0;
            double precioSeleccionado = 0;

            while (true) {
                try {
                    System.out.print("Opción: ");
                    opcionPiso = Integer.parseInt(sc.nextLine());

                    if (opcionPiso == 1) {
                        precioSeleccionado = PRECIO_LAMINADO;
                        break;
                    } else if (opcionPiso == 2) {
                        precioSeleccionado = PRECIO_MARMOLADO;
                        break;
                    } else if (opcionPiso == 3) {
                        precioSeleccionado = PRECIO_ACRILICO;
                        break;
                    } else {
                        System.out.println("Opción inválida.");
                    }
                } catch (Exception e) {
                    System.out.println("Entrada inválida.");
                }
            }

            // CÁLCULOS
            double subtotal = metrosCuadrados * precioSeleccionado;
            double descuentoAplicado = subtotal * DESCUENTO;
            double subtotalConDescuento = subtotal - descuentoAplicado;
            double impuestos = subtotalConDescuento * IVA;
            double total = subtotalConDescuento + impuestos;

            // CONFIRMAR COMPRA
            System.out.println("\n¿Desea aceptar la compra?");
            System.out.println("1. Sí");
            System.out.println("2. No");

            int aceptar = 0;

            while (true) {
                try {
                    System.out.print("Opción: ");
                    aceptar = Integer.parseInt(sc.nextLine());

                    if (aceptar == 1 || aceptar == 2) break;

                    System.out.println("Opción inválida. Solo 1 o 2.");

                } catch (Exception e) {
                    System.out.println("Entrada inválida.");
                }
            }

            if (aceptar == 2) {
                System.out.println("\nCompra cancelada. Regresando al menú principal...");
                continue;
            }

            // RESULTADOS FINALES (FORMATEADOS A 3 DECIMALES)
            System.out.println("\n=== COMPRA ACEPTADA ===");
            System.out.println("Comprador: " + nombre);
            System.out.println("Área total: " + String.format("%.3f", metrosCuadrados) + " m²");
            System.out.println("Precio por m²: $" + String.format("%.3f", precioSeleccionado));
            System.out.println("Subtotal: $" + String.format("%.3f", subtotal));
            System.out.println("Descuento (7.25%): -$" + String.format("%.3f", descuentoAplicado));
            System.out.println("Subtotal con descuento: $" + String.format("%.3f", subtotalConDescuento));
            System.out.println("IVA (16%): $" + String.format("%.3f", impuestos));
            System.out.println("TOTAL A PAGAR: $" + String.format("%.3f", total));
        }

        System.out.println("\nGracias por usar el sistema.");
        sc.close();
    }

    // MÉTODO PARA VALIDAR NÚMEROS MAYORES A 1 (ENTEROS O DECIMALES)
    public static double pedirNumero(Scanner sc, String mensaje) {
    double valor = 0;
    double LIMITE_MAXIMO = 10000.0; // Define aquí el límite que desees

    while (true) {
        try {
            System.out.print(mensaje);
            String entrada = sc.nextLine().trim();

            if (entrada.isEmpty()) {
                System.out.println("El valor no puede estar vacío.");
                continue;
            }

            // Regex explicada:
            // ^[0-9]+      -> Empieza con uno o más números
            // (\\.[0-9]{2,3})? -> Opcionalmente un punto seguido de EXACTAMENTE 2 o 3 números
            // $            -> Fin de la cadena
            if (!entrada.matches("^[0-9]+(\\.[0-9]{1,3})?$")) {
                System.out.println("Error: Ingrese un número con 2 o 3 decimales (ej: 10.50 o 10.505).");
                continue;
            }

            valor = Double.parseDouble(entrada);

            // Validación de rango
            if (valor <= 1) {
                System.out.println("El valor debe ser mayor a 1.");
            } else if (valor > LIMITE_MAXIMO) {
                System.out.println("El monto excede el límite de compra permitido ($" + LIMITE_MAXIMO + ").");
            } else {
                // Si pasa todas las validaciones, salimos del bucle
                break;
            }

        } catch (NumberFormatException e) {
            System.out.println("Entrada inválida. Asegúrese de usar el formato numérico correcto.");
        }
    }

    return valor;
}
}