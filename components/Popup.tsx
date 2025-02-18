import {
  Children,
  cloneElement,
  forwardRef,
  isValidElement,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  useFloating,
  autoUpdate,
  flip,
  offset,
  shift,
  useRole,
  useDismiss,
  useInteractions,
  FloatingPortal,
  FloatingFocusManager,
} from "@floating-ui/react";

export const Popup = forwardRef<
  HTMLButtonElement,
  React.HTMLProps<HTMLButtonElement>
>(({ children }, forwardedRef) => {
  const [isOpen, setIsOpen] = useState(false);

  const { refs, floatingStyles, context } = useFloating({
    open: isOpen,
    onOpenChange: setIsOpen,
    middleware: [
      offset({ mainAxis: 5, alignmentAxis: 4 }),
      flip({
        fallbackPlacements: ["left-start"],
      }),
      shift({ padding: 10 }),
    ],
    placement: "top",
    whileElementsMounted: autoUpdate,
  });

  const role = useRole(context, { role: "menu" });
  const dismiss = useDismiss(context);

  const { getFloatingProps, getItemProps } = useInteractions([role, dismiss]);

  useEffect(() => {
    function onMouseUp(e: MouseEvent) {
      const target = e.target as HTMLElement;

      if (refs.floating.current?.contains(target as Element | null)) {
        return;
      }

      if (
        target.isContentEditable ||
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA"
      ) {
        refs.setPositionReference({
          getBoundingClientRect() {
            return {
              width: 0,
              height: 0,
              x: e.clientX,
              y: e.clientY,
              top: e.clientY,
              right: e.clientX,
              bottom: e.clientY,
              left: e.clientX,
            };
          },
        });

        setIsOpen(true);
      }
    }

    document.addEventListener("mouseup", onMouseUp);

    return () => {
      document.removeEventListener("mouseup", onMouseUp);
    };
  }, [refs]);

  return (
    <FloatingPortal>
      {isOpen && (
        <FloatingFocusManager context={context} initialFocus={refs.floating}>
          <div
            ref={refs.setFloating}
            style={floatingStyles}
            {...getFloatingProps()}
          >
            {Children.map(
              children,
              (child) =>
                isValidElement(child) &&
                cloneElement(
                  child,
                  getItemProps({
                    //   onClick() {
                    //     child.props.onClick?.();
                    //     setIsOpen(false);
                    //   },
                    //   onMouseUp() {
                    //     child.props.onClick?.();
                    //     setIsOpen(false);
                    //   },
                  })
                )
            )}
          </div>
        </FloatingFocusManager>
      )}
    </FloatingPortal>
  );
});
